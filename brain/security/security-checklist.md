# Security Checklist â€” Yuktivya AI (market-intelligence-app)

> Assessment date: 2026-10-07 Â· HEAD `a8fc049` Â· Architecture: static client-only React/Vite SPA (no backend, DB, auth or secrets).
> Status legend: âœ… in place (verified) Â· âŒ missing / failing Â· âš ï¸ partial / needs verification Â· âž– not applicable to the current architecture

Related: [`threat-model.md`](./threat-model.md) Â· [`attack-surface.md`](./attack-surface.md) Â· [`secrets.md`](./secrets.md)

---

## Findings register

Findings are listed by severity. Each one follows the format **Severity â†’ Evidence â†’ Risk â†’ Affected location â†’ Why it matters â†’ Recommended fix**.

### Confirmed vulnerabilities

#### F-01 â€” `xlsx@0.18.5` has known Prototype Pollution and ReDoS flaws on the upload path
- **Severity:** High
- **Evidence:** `package.json` `"xlsx": "^0.18.5"`; `npm ls` â†’ `xlsx@0.18.5`; `npm audit` â†’ GHSA-4r6h-8v6p-xvw6 (CVSS 7.8, fixed in 0.19.3) and GHSA-5pgg-2g8v-p4x9 (CVSS 7.5, fixed in 0.20.2), "No fix available" on npm.
- **Risk:** A crafted `.xlsx` uploaded by the user pollutes `Object.prototype` or hangs the tab.
- **Affected location:** `src/engine/dataParser.ts` L98â€“109 (`XLSX.read`); `src/components/export/ReportExporter.tsx` L15, L59â€“111
- **Why it matters:** Parsing untrusted spreadsheets is the core feature, so the vulnerable path is always reachable.
- **Recommended fix:** Replace it with SheetJS â‰¥ 0.20.3 from `https://cdn.sheetjs.com/` (e.g. `npm i https://cdn.sheetjs.com/xlsx-0.20.3/xlsx-0.20.3.tgz`), commit the lockfile, and re-run `npm audit`.

#### F-02 â€” CSV formula injection in "Cleaned CSV" export
- **Severity:** Medium
- **Evidence:** `ReportExporter.tsx` L57â€“68 writes `cleanedData` via `json_to_sheet` â†’ `sheet_to_csv` with no escaping. `dataParser.ts` `autoCastValue` and `dataCleaner.ts` L136â€“153 pass non-numeric strings through unchanged, and no sanitiser exists in `src/`.
- **Risk:** Cells beginning with `=`, `+`, `-` or `@` (for example in scraped review text) execute as formulas when the CSV is opened in Excel or LibreOffice.
- **Affected location:** `src/components/export/ReportExporter.tsx` L57â€“68
- **Why it matters:** The output is marketed as "Sanitized" (`ReportExporter.tsx` L337, `README.md` L52), so users will trust it.
- **Recommended fix:** Prefix any string cell starting with `= + - @ \t \r` with `'` before CSV serialisation.

### Missing controls

#### F-03 â€” No Content-Security-Policy or security headers
- **Severity:** Medium
- **Evidence:** No CSP `<meta>` in `index.html`; no hosting or header configuration in the repo.
- **Risk:** Any injected script (supply chain, F-01 gadget) could exfiltrate the confidential datasets held in memory.
- **Affected location:** `index.html`; deployment layer (not in the repo)
- **Why it matters:** "Data never leaves the browser" is currently true only because of how the code is written; nothing enforces it.
- **Recommended fix:** Strict CSP with `connect-src 'self'`, `object-src 'none'` and `frame-ancestors 'none'`, plus HSTS, `nosniff` and `Referrer-Policy`. See `attack-surface.md` AS-04 for the full policy.

#### F-04 â€” No automated dependency scanning or reproducible installs
- **Severity:** Medium
- **Evidence:** No `.github/` (no Dependabot or CI); all dependencies use `^` ranges; `npm audit` currently reports 2 high and 1 low.
- **Risk:** Vulnerable or malicious versions ship unnoticed.
- **Affected location:** `package.json`, repo root
- **Why it matters:** The whole security posture of a client-only app depends on its bundle.
- **Recommended fix:** Enable Dependabot alerts and updates, add CI running `npm ci && npm audit --audit-level=high && npm run build`, and fix the transitive issues with `npm audit fix`.

#### F-05 â€” No file-size or row limits (the UI claims "Max 50MB")
- **Severity:** Low
- **Evidence:** No `file.size` check anywhere; `DataUploader.tsx` L158 shows the text "Max 50MB"; `file.arrayBuffer()` and `file.text()` read the whole file.
- **Risk:** Tab freeze or crash; amplifies the F-01 ReDoS.
- **Affected location:** `src/components/upload/DataUploader.tsx` L37â€“84
- **Why it matters:** The UI promises a limit that is not enforced.
- **Recommended fix:** Check `file.size <= 50 * 1024 * 1024` and the paste length before parsing, and cap rows and columns.

#### F-06 â€” `.env` files not git-ignored
- **Severity:** Low (preventive)
- **Evidence:** `.gitignore` ignores only `*.local`.
- **Risk:** Any future secret placed in `.env` would be committed.
- **Affected location:** `.gitignore`
- **Why it matters:** Secrets leaked to Git are permanent.
- **Recommended fix:** Add `.env` and `.env.*` (with `!.env.example`). See `secrets.md` S-01.

### Security weaknesses

#### F-07 â€” Spread-based `Math.min/max` overflow on large columns
- **Severity:** Low
- **Evidence:** `dataCleaner.ts` L61â€“62 and `marketValueModel.ts` L15â€“16 use `Math.min(...arr)`. The resulting `RangeError` is caught at `DataUploader.tsx` L61, so analysis fails with an error message.
- **Risk:** Denial of analysis for large datasets.
- **Affected location:** the files above
- **Why it matters:** Reliability and availability.
- **Recommended fix:** Use a loop or `reduce` to compute min and max.

#### F-08 â€” Reports labelled "Verified Dataset Analysis" for any upload
- **Severity:** Low
- **Evidence:** `ReportExporter.tsx` L252 prints `'Verified Dataset Analysis'` whenever `isSyntheticDemo` is false (that is, for any user upload or paste).
- **Risk:** Integrity and misrepresentation: an arbitrary or forged dataset produces a report that claims verification.
- **Affected location:** `src/components/export/ReportExporter.tsx` L251â€“255
- **Why it matters:** Business decisions may rely on these reports.
- **Recommended fix:** Use neutral wording such as "User-Supplied Dataset (unverified)".

### Potential risks requiring verification

#### F-09 â€” Hosting security (HTTPS, headers, access) unknown
- **Severity:** Info â†’ Medium depending on the host
- **Evidence:** No deployment config in the repo.
- **Risk:** Serving over HTTP, or from a host without headers, enables tampering with the delivered JS.
- **Recommended fix:** Document the hosting target and verify HTTPS, HSTS and the headers from F-03.

#### F-10 â€” `dompurify@3.4.15` (via `jspdf`) has low-severity XSS advisories
- **Severity:** Low
- **Evidence:** `npm audit` reports GHSA-p98j-92pf-mc4p and GHSA-6688-9rhm-gjv2. It is used only by `jsPDF.html()`, which the app does not call (only `doc.text()` is used, at `ReportExporter.tsx` L115â€“263).
- **Risk:** Becomes reachable if `doc.html()` is adopted.
- **Recommended fix:** Run `npm audit fix` to pull the patched DOMPurify.

#### F-11 â€” GitHub repository visibility
- **Severity:** Info
- **Evidence:** Remote `github.com/Shivam-kumar-92/AI-analytics-`. Visibility cannot be determined locally.
- **Recommended fix:** Confirm the intended visibility and enable secret-scanning push protection.

### Recommendations

| ID | Recommendation | Evidence |
|---|---|---|
| R-01 | Self-host fonts (or disclose Google Fonts in a privacy notice); remove the duplicate loading | `index.html` L18â€“20 and `src/index.css` L1 both load Google Fonts |
| R-02 | Remove unused direct dependency `html2canvas` (jsPDF lazy-loads its own) | Not imported anywhere in `src/` |
| R-03 | Move `@types/three` to `devDependencies` | `package.json` |
| R-04 | Revoke Blob URLs after download (`URL.revokeObjectURL`) | `ReportExporter.tsx` L63 |
| R-05 | Update `source-map-js` (build-time) via `npm audit fix` | `npm audit` GHSA-68fv-2mgg-jv7q, `source-map-js@1.2.1` |
| R-06 | Whitelist hash values to known tab IDs and fall back to `landing` | `App.tsx` L31 (no current impact) |
| R-07 | Add a short privacy statement in the UI ("data is processed locally and never uploaded"). This is accurate today and would be backed by F-03 | â€” |

---

## Checklist by domain

### Authentication
| â˜/â˜‘ | Item | Status |
|---|---|---|
| âž– | Login / MFA / password policy | No auth exists. No user accounts or server data to protect |
| âš ï¸ | Re-assess before adding any backend, cloud save or LLM API | Required at that point |

### Authorization / RBAC
| âž– | Roles, tenant isolation, object-level access | No server or shared data. Each user's data stays in their own tab |

### Session / token security
| âž– | Cookies, JWT, refresh tokens | None used (0 matches for cookie and storage APIs) |

### Input validation
| Status | Item | Evidence |
|---|---|---|
| âœ… | Parse errors handled gracefully | `DataUploader.tsx` L61â€“62, L79â€“80 |
| âš ï¸ | File type checked by extension only | `DataUploader.tsx` L44. Acceptable, since all content is parsed as data |
| âŒ | File size, row and column limits | F-05 |
| âŒ | Vulnerable XLSX parser | F-01 |

### Injection
| Status | Item | Evidence |
|---|---|---|
| âž– | SQL / NoSQL / command injection | No DB, shell or server |
| âœ… | No `eval` / `new Function` | grep: 0 matches |
| âŒ | Spreadsheet formula injection (CSV export) | F-02 |
| âœ… | Global prototype pollution via custom CSV/JSON path | CSV assigns primitives only (`dataParser.ts` L44â€“48). For JSON, a `__proto__` key can at most change the prototype of a single `cleanedRow` object (`dataCleaner.ts` L152), not `Object.prototype`. F-01 (xlsx) remains the real pollution vector |

### XSS / CSRF
| Status | Item | Evidence |
|---|---|---|
| âœ… | No raw HTML sinks | 0 matches for `dangerouslySetInnerHTML`, `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `document.write` |
| âœ… | Uploaded values, chat and file names rendered as text | `DataPreviewTable.tsx` L189â€“191, `AiAnalystChat.tsx` L160 |
| âœ… | PDF built with `doc.text()` only | `ReportExporter.tsx` |
| âŒ | CSP as defence in depth | F-03 |
| âž– | CSRF | No server-side state-changing endpoints |

### API security
| âž– | Auth, validation, versioning of APIs | No APIs exist (0 network calls in `src/`) |

### Rate limiting / abuse
| âž– | Server rate limits | No server |
| âš ï¸ | Client-side resource abuse (large or malicious files) | F-01 (ReDoS), F-05, F-07 |

### File uploads
| Status | Item | Evidence |
|---|---|---|
| âœ… | Files never leave the browser and are never stored | No network or storage APIs |
| âŒ | Size limit enforced | F-05 |
| âŒ | Patched parser | F-01 |

### Database security
| âž– | All items | No database |

### Secrets
| Status | Item | Evidence |
|---|---|---|
| âœ… | No secrets in code, config, `dist/` or git history | `secrets.md` Â§3, Â§5 |
| âœ… | No `VITE_*` / env vars inlined into the bundle | 0 matches for `import.meta.env` |
| âŒ | `.env` git-ignored | F-06 |

### Encryption
| Status | Item | Evidence |
|---|---|---|
| âž– | Data at rest | Nothing persisted |
| âš ï¸ | Transport (HTTPS/HSTS) | Depends on the host. F-09 |

### CORS
| âž– | CORS policy | No server endpoints. Google Fonts uses its own CORS (`crossorigin` on the preconnect in `index.html` L16) |

### Dependency security
| Status | Item | Evidence |
|---|---|---|
| âœ… | Lockfile committed | `package-lock.json` |
| âŒ | `npm audit` clean | 2 high, 1 low (F-01, F-10, R-05) |
| âŒ | Automated scanning / CI | F-04 |
| âš ï¸ | Unused dependency | R-02 |

### Logging / monitoring
| Status | Item | Evidence |
|---|---|---|
| âœ… | No sensitive data logged remotely | No telemetry |
| âš ï¸ | One `console.error(err)` | `ReportExporter.tsx` L259. Local only, low risk |
| âž– | Server audit logs / alerting | No server |

### Admin security
| âž– | Admin panels / privileged routes | None exist |

### Deployment / infrastructure
| Status | Item | Evidence |
|---|---|---|
| âœ… | No production source maps | Vite default; no `.map` in `dist/` |
| âœ… | `dist/` not committed | `.gitignore` |
| âœ… | Dev server bound to localhost by default | `vite.config.ts` has no `server.host` |
| âŒ | Security headers / CSP | F-03 |
| âš ï¸ | Hosting / HTTPS documented | F-09 |
| âŒ | CI pipeline | F-04 |

### Data privacy
| Status | Item | Evidence |
|---|---|---|
| âœ… | Uploaded data processed locally, not transmitted, not persisted | No network or storage APIs |
| âš ï¸ | Third-party requests (Google Fonts) expose visitor IP | R-01 |
| âš ï¸ | No privacy notice in the UI | R-07 |
| âš ï¸ | Exported files may contain PII from review datasets; users manage them | Inherent to the feature |

### Error handling
| Status | Item | Evidence |
|---|---|---|
| âœ… | Parser errors caught and shown as text | `DataUploader.tsx` |
| âœ… | PDF export wrapped in `try/finally` | `ReportExporter.tsx` L117â€“262 |
| âš ï¸ | CSV/XLSX export handlers have no `try/catch` | `ReportExporter.tsx` L57â€“112. Failures surface only as uncaught console errors |
| âž– | Stack traces to remote clients | No server |

### Backup / recovery
| Status | Item | Evidence |
|---|---|---|
| âž– | Data backups | The app stores no data. Users keep their source files and exports |
| âœ… | Source recoverability | Git history plus the GitHub remote |
| âš ï¸ | Session loss on reload (all analysis lost) | By design; a usability concern, not a security one |

---

## Priority order

1. **F-01**: upgrade SheetJS (High)
2. **F-02**: neutralise CSV formulas (Medium)
3. **F-03 / F-09**: CSP and headers at the host (Medium)
4. **F-04**: Dependabot, CI and `npm audit fix` (Medium)
5. **F-05, F-06, F-07, F-08**: low-effort hardening (Low)
6. Recommendations R-01 to R-07

## Verification statement

All âœ… items were confirmed against the source on 2026-10-07. This checklist does **not** claim any authentication, authorization, rate limiting, CSP, CI, secret management or encryption controls, because none exist in this repository. âž– items are not applicable only because the architecture has no server, database or user accounts. If any of those are added, these items must be re-evaluated.
