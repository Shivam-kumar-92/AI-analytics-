# Secrets Assessment — Yuktivya AI (market-intelligence-app)

> Assessment updated: 2026-10-08 · HEAD update · **No hardcoded secret values are stored in this repository.**

## Summary

**The repository contains no hardcoded or committed secrets.** It is a client-side React/Vite application. 

For AI analysis, it features a dual architecture:
1. **Zero-Configuration Heuristic Engine:** Offline deterministic natural language analytics requiring no API keys ([`aiAnalystEngine.ts`](file:///c:/Users/admin/.gemini/market-intelligence-app/src/engine/aiAnalystEngine.ts)).
2. **Bring-Your-Own-Key (BYOK) Gemini Engine:** Optional neural analysis ([`geminiAnalystEngine.ts`](file:///c:/Users/admin/.gemini/market-intelligence-app/src/engine/geminiAnalystEngine.ts)) where users supply their own Gemini API key stored strictly in browser `sessionStorage` (ephemeral to the browser tab).

---

## 1. Where secrets are expected & managed

| Potential secret | Expected in Repo? | Implementation & Security Controls |
|---|---|---|
| Gemini / LLM API Key | **No** (BYOK client-side) | Stored only in `sessionStorage` (`yuktivya_gemini_api_key`). Transmitted exclusively over HTTPS via `x-goog-api-key` header to Google Generative Language API. Never committed or bundled into code. |
| Backend / database credentials | **No** | No backend or database used; client-side simulation & analytics engines. |
| Auth provider keys | **No** | Not used in current architecture. |
| Analytics / monitoring keys | **No** | Not used. |
| Google Fonts | No key required | Loaded via standard CSS/HTML link tags. |
| Vercel Deployment | Outside repository | Configured in [vercel.json](file:///c:/Users/admin/.gemini/market-intelligence-app/vercel.json) with strict CSP headers (`connect-src 'self' https://generativelanguage.googleapis.com;`). |
| GitHub push credentials | Outside repository | Managed via Git Credential Manager. |

---

## 2. Environment and configuration handling

| Check | Result | Evidence |
|---|---|---|
| `.env`, `.env.*` files present in Git | **None** | Verified clean in working tree & Git status |
| `import.meta.env` / `process.env` secrets | **0 matches** | No hardcoded or bundled env secrets |
| `.gitignore` covers `.env` | **Resolved (PASS)** | Lines 13–15 in `.gitignore` ignore `.env`, `.env.*`, and preserve `!.env.example` |
| Content Security Policy (CSP) | **Strictly defined** | `vercel.json` restricts `connect-src` to `'self'` and `https://generativelanguage.googleapis.com` |

---

## 3. Hardcoded-secret risks

| Scope | Result | Notes |
|---|---|---|
| `src/**` (all `.ts`, `.tsx`, `.css`) | **No hardcoded secrets** | Full regex and keyword scan clean |
| `src/engine/geminiAnalystEngine.ts` | **Protected (Header Auth)** | Uses HTTP header `x-goog-api-key` rather than URL query parameters to avoid log/referrer leakage |
| `src/datasets/*.ts` | **Synthetic demo data only** | Curated Indian market datasets; no private or sensitive information |
| `dist/` build output | **No secrets embedded** | No `VITE_*` secrets injected |

---

## 4. Client-side exposure considerations

> [!NOTE]
> In client-side BYOK architectures:
> - The user's Gemini API key is stored in `sessionStorage`, which automatically clears when the browser tab is closed.
> - The key is sent directly from the client to Google's API endpoint over HTTPS.
> - If an enterprise-managed central API key is introduced in the future, it should be proxied through a serverless backend function (e.g. Vercel Serverless Function `/api/analyze`) rather than placed in client bundles.

---

## 5. Git and history exposure risks

| Check | Result | Evidence |
|---|---|---|
| Full-history content scan (`git log --all -p`) for API tokens and private keys | **0 matches** | Clean commit history |
| Sensitive file names in Git history | **None** | No `.env` or credentials ever committed |
| Remote repository | `Shivam-kumar-92/AI-analytics-.git` | Push protection recommended if made public |

---

## 6. Audit findings status

### S-01 — `.env` files coverage in `.gitignore`
- **Status:** **Resolved**
- **Action Taken:** `.gitignore` includes `.env` and `.env.*`.

### S-02 — API Key transport security in `GeminiAnalystEngine`
- **Status:** **Resolved**
- **Action Taken:** API key is sent via request header `x-goog-api-key` instead of query parameter `?key=...`, eliminating risk of URL exposure in logs and headers.

### S-03 — Serverless boundary for enterprise keys
- **Status:** **Documented Recommendation**
- **Guidance:** Client-side BYOK is safe for end-user personal keys. If a shared organizational quota key is added later, route via a serverless proxy endpoint.
