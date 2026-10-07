# Secrets Assessment â€” Yuktivya AI (market-intelligence-app)

> Assessment date: 2026-10-07 Â· HEAD `a8fc049` Â· **No secret values are reproduced in this document.**

## Summary

**The project currently uses no secrets.** It is a static, client-only React/Vite app with no backend, no third-party API keys, no database credentials and no auth tokens. No secrets were found in the working tree, the build output, or the full git history.

The remaining risks are **preventive**: the repository is not yet set up to keep secrets safe if any are introduced later, and secrets in a client-only Vite app are inherently public.

---

## 1. Where secrets are expected

| Potential secret | Expected? | Evidence |
|---|---|---|
| LLM / AI API key (OpenAI, Gemini, etc.) | **No.** The "AI Analyst" is a local keyword engine | `src/engine/aiAnalystEngine.ts` (`answerQuery` uses `q.includes(...)`, no network) |
| Backend / database credentials | **No.** There is no backend or DB | `package.json` has no server or DB dependencies |
| Auth provider keys (Firebase, Auth0, Supabase) | **No** | Not present in dependencies or code |
| Analytics / monitoring keys | **No** | Not present |
| Google Fonts | No key required | `index.html` L18â€“20, `src/index.css` L1 |
| Hosting / deploy tokens | Not in repo (no CI or deploy config) | No `.github/`, Vercel, Netlify, Firebase or Docker files |
| GitHub push credentials | Stored outside the repo (git credential manager) | Remote URL `https://github.com/Shivam-kumar-92/AI-analytics-.git` contains no embedded token |

## 2. Environment and configuration handling

| Check | Result | Evidence |
|---|---|---|
| `.env`, `.env.*` files present | **None** in the working tree | Root listing (`Get-ChildItem -Force`) |
| `import.meta.env` / `process.env` usage | **0 matches** in `src/` | grep |
| `vite.config.ts` defines/env injection | None. Only the `react()` and `tailwindcss()` plugins | `vite.config.ts` |
| `.gitignore` covers `.env` | **Partially.** Only `*.local` is ignored (so `.env.local` and `.env.production.local` are covered), but **`.env`, `.env.production` and `.env.development` are NOT ignored** | `.gitignore` |

## 3. Hardcoded-secret risks

| Scope | Result |
|---|---|
| `src/**` (all `.ts` / `.tsx` / `.css`) | **No hardcoded secrets.** A case-insensitive grep for `apiKey`, `api_key`, `token`, `password` and `secret` returned 0 secret-related matches |
| `index.html`, config files | None |
| `src/datasets/*.ts` | Synthetic demo data only, no credentials |
| `dist/` (local build output) | Contains only bundled JS/CSS/images; no `.env` was injected because no env vars are used. `dist/` is git-ignored |

## 4. Client-side exposure risks

> [!WARNING]
> Vite inlines **every** `VITE_*` environment variable into the public JS bundle at build time. Anything placed there is readable by every visitor.

| Finding | Class | Severity |
|---|---|---|
| No client-side secrets today | â€” | â€” |
| Architectural constraint: any future AI/API key added to this app **cannot be kept secret** without a server-side proxy | Potential risk (future) | Info |

## 5. Git and history exposure risks

| Check | Result | Evidence |
|---|---|---|
| Full-history content scan (`git log --all -p`) for API-key, token, password, private-key, AWS (`AKIAâ€¦`), Google (`AIzaâ€¦`), OpenAI (`sk-â€¦`) and GitHub (`ghp_â€¦`) patterns | **0 matches** | Scan run 2026-10-07 |
| Sensitive file names ever committed (`.env`, `.pem`, `.key`, `credentials`, `firebase`, deploy configs) | **None** | `git log --all --name-only` |
| Commits in history | 5 (`61ceec1` â†’ `a8fc049`) | `git log` |
| Repository visibility on GitHub | **Unknown.** It has to be checked on GitHub | Potential risk (verify). Low impact because no secrets exist |

## 6. Logging and error exposure risks

| Location | Behaviour | Risk |
|---|---|---|
| `src/components/export/ReportExporter.tsx` L259 | `console.error(err)` on PDF failure | Low. Local console only, no secrets involved |
| `src/components/upload/DataUploader.tsx` L62, L80 | Parser `err.message` shown in the UI | Low. Messages come from the local parser and contain no secrets |
| Remote logging / telemetry | **None** | â€” |

## 7. Secret rotation requirements

| Item | Requirement today |
|---|---|
| Application secrets | **None to rotate** |
| GitHub account / PAT used to push | Follow standard account hygiene (2FA, fine-grained PATs). This is outside the repo |
| Future secrets | Define rotation **before** introducing them: server-side storage only, a per-environment key, and rotation on any suspected exposure |

---

## 8. Findings

### S-01 â€” `.env` files are not git-ignored
- **Class:** Missing control
- **Severity:** Low (preventive)
- **Evidence:** `.gitignore` contains `*.local` but no `.env` or `.env.*` entry.
- **Risk:** If a developer later adds an API key in `.env` or `.env.production`, `git add .` commits it to GitHub.
- **Affected location:** `.gitignore`
- **Why it matters:** A secret pushed to GitHub has to be treated as compromised, even if it is deleted later, because it remains in history and forks.
- **Recommended fix:** Add `.env` and `.env.*` (keeping an optional `!.env.example`) to `.gitignore`. Optionally enable GitHub secret scanning and push protection.

### S-02 â€” No server-side boundary for future secrets
- **Class:** Potential risk (future) / Recommendation
- **Severity:** Info
- **Evidence:** The app is pure static (`vite build` output only). The README markets "AI" features that are currently local heuristics.
- **Risk:** Wiring a real LLM API directly from the browser would expose the key to everyone and allow quota and billing abuse.
- **Affected location:** Architecture (`src/engine/aiAnalystEngine.ts` would be the integration point)
- **Why it matters:** Client bundles are public.
- **Recommended fix:** If external APIs are added, route them through a server or serverless proxy that holds the key, with auth and rate limiting. Never use `VITE_`-prefixed variables for secrets.

### S-03 â€” Repository visibility not verified
- **Class:** Potential risk requiring verification
- **Severity:** Info
- **Evidence:** Remote `github.com/Shivam-kumar-92/AI-analytics-`. Visibility cannot be determined from the local clone.
- **Risk:** Low today (no secrets). It matters if secrets or proprietary datasets are ever committed.
- **Recommended fix:** Confirm the intended visibility on GitHub. If the repo is public, keep S-01 in place and enable push protection.

## 9. Verification statement

Every statement above was checked against the current tree and history on 2026-10-07. This document does **not** claim that any secret-management control (vault, KMS, CI secrets, scanning) exists, because none does in this repository.
