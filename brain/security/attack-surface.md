# Attack Surface â€” Yuktivya AI (market-intelligence-app)

> Assessment date: 2026-10-07 Â· HEAD `a8fc049`
> The app is a **static, client-only SPA**, so its attack surface is concentrated in **untrusted file parsing**, **exported files**, **code delivery** and the **dependency supply chain**. There is no server-side surface in this repository.

---

## 1. Public endpoints

| Endpoint | Type | Notes |
|---|---|---|
| `/` (`index.html`) | Static HTML | Loads `/src/main.tsx` (dev) or hashed bundle (prod) |
| `/assets/*.js`, `/assets/*.css` | Static bundle | Built by `vite build` â†’ `dist/assets/` (`index-*.js`, `html2canvas-*.js`, `index.es-*.js`, `purify.es-*.js`, `index-*.css`) |
| `/favicon.svg`, `/icons.svg`, `/make_in_india_lion.jpg`, `/make_in_india_lion_3d.jpg` | Static assets | From `public/` |
| `#landing`, `#upload`, `#preview`, `#overview`, `#sentiment`, `#demand`, `#pricing`, `#competitor`, `#correlations`, `#chat`, `#export` | Client-side hash "routes" | `App.tsx` L31, L242â€“314. Unknown hashes render no tab content (no error, no injection) |

**No HTTP API endpoints exist.**

## 2. Internal endpoints

None. There are no internal services, admin APIs, health checks or RPCs.

Dev-only: `npm run dev` (Vite dev server, default `localhost:5173`) and `npm run preview`. `vite.config.ts` does **not** set `server.host`, so the dev server binds to localhost by default and is not exposed on the LAN unless it is started with `--host`.

## 3. Authentication and authorization surfaces

| Surface | Status |
|---|---|
| Login / signup / password reset | **Not implemented** |
| Sessions, JWT, cookies | **Not implemented** |
| Roles / RBAC / tenant isolation | **Not implemented** |

All features are available to anyone who can load the page. Because data is never sent to a server and lives only in the visitor's own tab, the missing auth does **not** expose one user's data to another user.

## 4. User inputs

| Input | Location | Sink | Handling |
|---|---|---|---|
| File upload (CSV/XLSX/XLS/JSON/TXT) | `DataUploader.tsx` L37â€“66, L140â€“146 | `DataParser` â†’ `DataCleaner` â†’ engines â†’ React state | Extension-based routing only (`file.name.split('.').pop()`); **no size, row or column limits**; `accept` attribute is advisory only |
| Paste textarea | `DataUploader.tsx` L189â€“195 | `DataParser.parseText` | Auto-detects JSON or CSV; no size limit |
| Chat text | `AiAnalystChat.tsx` L216â€“223 | `AIAnalystEngine.answerQuery` (substring matching) | Rendered as a React text node; never executed or sent anywhere |
| "Specify industry..." text | `Navbar.tsx` L166â€“172, L360â€“366 | Analyst context `industry` | React text only |
| URL hash | `App.tsx` L31 | `activeTab` state | Equality comparisons only |
| Column headers and cell values in uploaded data | `dataParser.ts` L35â€“48 | Object keys, table headers, chat text, PDF text, CSV/XLSX export | Escaped in the UI; **not neutralised for spreadsheet formulas in the CSV export** (see AS-02) |
| File name | `DataUploader.tsx` | UI label, product-name fallback | React text only |

## 5. File uploads

| Aspect | Implementation | Evidence |
|---|---|---|
| Processing location | Browser memory only. Nothing is stored or uploaded to a server | No network or storage APIs in `src/` |
| XLSX/XLS parser | `xlsx@0.18.5` â†’ `XLSX.read(buffer, { type: 'array' })` | `dataParser.ts` L101; `npm ls` |
| JSON parser | `JSON.parse` | `dataParser.ts` L79 |
| CSV/TXT parser | Custom split-based parser | `dataParser.ts` L15â€“75 |
| Size limit | **None** (UI text claims "Max 50MB") | `DataUploader.tsx` L158; no `file.size` check anywhere |
| Content validation | Extension only; no MIME/magic-byte check (mostly irrelevant, since everything is parsed as data) | `DataUploader.tsx` L44 |

## 6. Database access

None. There is no database, ORM or query layer.

## 7. Storage

| Storage | Used? |
|---|---|
| Server / cloud object storage | No |
| `localStorage` / `sessionStorage` / `IndexedDB` / cookies | No (0 grep matches) |
| Downloads written to the user's disk | Yes: CSV (`Blob` + `createObjectURL`), XLSX (`XLSX.writeFile`), PDF (`jsPDF.save`) in `ReportExporter.tsx` |

Minor: `URL.createObjectURL(blob)` (`ReportExporter.tsx` L63) is never revoked. This is a small memory leak per export, with no security impact.

## 8. Webhooks

None.

## 9. Third-party integrations

| Integration | Direction | Data sent | Evidence |
|---|---|---|---|
| Google Fonts (`fonts.googleapis.com`, `fonts.gstatic.com`) | Browser â†’ Google | Visitor IP, User-Agent, Referer (no dataset content) | `index.html` L18â€“20 and `src/index.css` L1 (loaded twice, with different families) |
| GitHub (source hosting) | Developer â†’ GitHub | Source code | `git remote -v` |
| Shields.io badges | README only (not in the app) | â€” | `README.md` L5â€“9 |

There is no LLM, analytics, payment, email or auth provider integration.

## 10. Admin surfaces

None. There are no admin routes, debug panels, feature flags or privileged modes in `src/`.

## 11. Network and deployment exposure

| Item | Status |
|---|---|
| Hosting target | **Not defined in the repo** (no Dockerfile, nginx, Vercel/Netlify/Firebase/GitHub Pages config) |
| HTTPS / HSTS | Unknown; depends on the host (Potential risk, verify) |
| Content-Security-Policy | **Absent.** There is no `<meta http-equiv="Content-Security-Policy">` in `index.html` and no header config in the repo |
| `X-Frame-Options` / `frame-ancestors` | Absent (clickjacking has low impact: no state-changing server actions) |
| `Referrer-Policy`, `Permissions-Policy`, `X-Content-Type-Options` | Absent in the repo |
| Source maps in production | Vite's default `build.sourcemap = false`; `vite.config.ts` does not override it, and no `.map` files are in `dist/` |
| CI/CD | None (no `.github/`) |

## 12. Dependencies and other externally reachable surfaces

`npm audit` (2026-10-07): **3 vulnerabilities (2 high, 1 low)**.

| Package | Installed | Runtime-reachable? | Advisory | Assessment |
|---|---|---|---|---|
| `xlsx` (direct) | 0.18.5 | **Yes.** Parses every uploaded `.xlsx`/`.xls` and is used for export | GHSA-4r6h-8v6p-xvw6 (Prototype Pollution, < 0.19.3); GHSA-5pgg-2g8v-p4x9 (ReDoS, < 0.20.2). npm reports **no fix available** because SheetJS stopped publishing to npm | **Confirmed vulnerability**: see AS-01 |
| `dompurify` (transitive via `jspdf@4.2.1`) | 3.4.15 | Bundled (`purify.es-*.js`) but only used by `jsPDF.html()`, which the app **never calls** | GHSA-p98j-92pf-mc4p, GHSA-6688-9rhm-gjv2 (low) | Potential risk, not reachable today |
| `source-map-js` (transitive via `postcss@8.5.28`, `@tailwindcss/node@4.3.3`) | 1.2.1 | **No** (build-time only) | GHSA-68fv-2mgg-jv7q | Recommendation |
| `html2canvas` (direct) | 1.4.1 | Not imported by app code; lazily bundled by jsPDF | â€” | Unused direct dependency (Recommendation) |
| `three`, `recharts`, `react`, `lucide-react` etc. | per lockfile | Yes | None reported | â€” |

Version pinning: all dependencies use caret (`^`) ranges. `package-lock.json` is committed, but nothing in the repo enforces `npm ci`.

---

## 13. Key attack-surface findings

### AS-01 â€” Vulnerable SheetJS (`xlsx@0.18.5`) parses untrusted uploads
- **Class:** Confirmed vulnerability
- **Severity:** High
- **Evidence:** `package.json` has `"xlsx": "^0.18.5"`; `npm ls` shows `xlsx@0.18.5`; `dataParser.ts` L101 calls `XLSX.read(buffer, { type: 'array' })` on user files; `npm audit` flags GHSA-4r6h-8v6p-xvw6 and GHSA-5pgg-2g8v-p4x9.
- **Risk:** A crafted workbook can pollute `Object.prototype` (corrupting logic or enabling script gadgets) or hang the tab through ReDoS.
- **Affected location:** `src/engine/dataParser.ts` L98â€“109; `src/components/export/ReportExporter.tsx` (export path)
- **Why it matters:** Parsing third-party spreadsheets is the app's core function, so the vulnerable code runs on attacker-influenced input by design.
- **Recommended fix:** Install a patched SheetJS (â‰¥ 0.20.3) from the official distribution (`https://cdn.sheetjs.com/`), commit the updated lockfile, and re-run `npm audit`.

### AS-02 â€” CSV export does not neutralise spreadsheet formulas
- **Class:** Confirmed vulnerability (CWE-1236)
- **Severity:** Medium
- **Evidence:** `ReportExporter.tsx` L57â€“68 converts `cleanedData` with `XLSX.utils.json_to_sheet` â†’ `sheet_to_csv` and downloads it unchanged. `DataParser.autoCastValue` (`dataParser.ts` L120â€“138) keeps strings like `=HYPERLINK(...)` as strings. No sanitiser exists anywhere in `src/`.
- **Risk:** A malicious cell value from a review or other third-party dataset executes as a formula when the "Cleaned CSV" is opened in Excel or LibreOffice (data exfiltration via `HYPERLINK`/`WEBSERVICE`, DDE prompts).
- **Affected location:** `src/components/export/ReportExporter.tsx` L57â€“68
- **Why it matters:** The README and UI describe this file as a "Sanitized" dataset ready for downstream use, so users will trust it.
- **Recommended fix:** Before writing the CSV, prefix string cells that begin with `=`, `+`, `-`, `@`, TAB or CR with `'`. (The XLSX export stores strings as text cells and is not affected in the same way.)

### AS-03 â€” No input size or row limits
- **Class:** Missing control
- **Severity:** Low
- **Evidence:** No `file.size` or row-count check exists; `DataUploader.tsx` L158 claims "Max 50MB"; `Math.min(...arr)` / `Math.max(...arr)` in `dataCleaner.ts` L61â€“62 and `marketValueModel.ts` L15â€“16 overflow the call stack on very large columns (the error is caught and shown to the user).
- **Risk:** Tab freeze or crash, and failed analysis for large legitimate datasets. Availability only, limited to the user's own tab.
- **Affected location:** `DataUploader.tsx` L37â€“66, L68â€“84; `dataCleaner.ts`; `marketValueModel.ts`
- **Why it matters:** The UI claims a limit that does not exist, and the oversized-input path also amplifies AS-01's ReDoS.
- **Recommended fix:** Reject files over 50 MB before reading them, cap rows and columns, and replace spread-based min/max with a loop.

### AS-04 â€” No CSP or security headers defined
- **Class:** Missing control (plus Potential risk: the hosting configuration is unknown)
- **Severity:** Medium
- **Evidence:** `index.html` has no CSP meta tag; the repo has no hosting or header configuration.
- **Risk:** If any script injection occurs (dependency compromise, AS-01 gadget), nothing blocks exfiltration of in-memory confidential datasets.
- **Affected location:** `index.html`, the (absent) hosting configuration
- **Why it matters:** The app's main privacy promise is that data never leaves the browser. A strict `connect-src 'self'` would enforce that promise technically.
- **Recommended fix:** Serve `Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' https://fonts.googleapis.com 'unsafe-inline'; font-src https://fonts.gstatic.com; img-src 'self' data: blob:; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'`. Also serve HSTS, `X-Content-Type-Options: nosniff` and `Referrer-Policy: no-referrer`. Verify that Three.js and Recharts work under this policy.
