# Codebase Audit & Findings Report

**Project:** `create-mexn-app-templates`  
**Templates Analyzed:**
- `cjs` (CommonJS Template)
- `esm-js` (ECMAScript Modules JavaScript Template)
- `esm-ts` (TypeScript with ESM Template)

---

## Table of Contents
1. [Executive Summary](#1-executive-summary)
2. [Critical Bugs & Runtime Errors (P0 / P1)](#2-critical-bugs--runtime-errors-p0--p1)
3. [Security Vulnerabilities & Risks](#3-security-vulnerabilities--risks)
4. [Cross-Template Inconsistencies & Architecture Discrepancies](#4-cross-template-inconsistencies--architecture-discrepancies)
5. [Code Quality, Types & DX Issues](#5-code-quality-types--dx-issues)
6. [Recommended Upgrades & Modernization Roadmap](#6-recommended-upgrades--modernization-roadmap)

---

## 1. Executive Summary

This repository is a monorepo containing boilerplate templates for generating Node.js / Express / MongoDB (MEXN) backend applications via `create-mexn-app`.

During the deep-dive audit across all templates, several **critical runtime blockers** (such as broken file logging paths, missing npm dependencies like `jsonwebtoken` and `bcrypt`, unhandled error crashes, and request-hanging rate limiter bugs) were identified alongside **architectural inconsistencies** (e.g., `esm-ts` actually building as CommonJS, mismatched folder casing, missing Swagger in `esm-ts`, and missing Dockerfiles).

---

## 2. Critical Bugs & Runtime Errors (P0 / P1)

### 2.1 Broken File Logger Path in `esm-js` (P0)
* **File:** `esm-js/src/utils/logger.js` (lines 14 & 80–86)
* **Code:**
  ```js
  const __fileName = `../../logs/${config.env}.log`;
  ...
  filename: dirname(__fileName), // Resolves to "../../logs" (directory name, dropping the filename)
  ```
* **Root Cause & Impact:** Calling `dirname(__fileName)` strips the `.log` filename, causing Winston to attempt creating/writing to a file literally named `'../../logs'` without an extension. Furthermore, relative paths in Winston resolve relative to `process.cwd()`, writing outside the project root or failing with file system errors.
* **Fix:** Use `path.join(process.cwd(), 'logs', `${config.env}.log`)` or `new URL('../../logs/${config.env}.log', import.meta.url)`.

---

### 2.2 Missing Dependencies in `package.json` (`cjs` & `esm-js`) (P0)
* **Files:**
  - `cjs/src/middlewares/Auth.middleware.js` (requires `jsonwebtoken`)
  - `cjs/src/utils/utils.js` (requires `bcrypt`)
  - `esm-js/src/middlewares/Auth.middleware.js` (imports `jsonwebtoken`)
  - `esm-js/src/utils/utils.js` (imports `bcrypt`)
* **Root Cause & Impact:** Neither `cjs/package.json` nor `esm-js/package.json` declare `jsonwebtoken` or `bcrypt` in `dependencies`. Any user creating a project from these templates and using auth or password hashing utils will hit immediate runtime crashes (`Cannot find module 'jsonwebtoken'` / `Cannot find module 'bcrypt'`).
* **Fix:** Add `jsonwebtoken` and `bcrypt` (or `bcryptjs` for pure-JS zero-native-compilation support) to `dependencies` or remove the dead utility files if not intended as part of the starter.

---

### 2.3 `HealthRoute` Missing `next` Callback in Route Handler (`cjs` & `esm-js`) (P1)
* **Files:** `cjs/src/routes/HealthRoute.js` (line 17), `esm-js/src/routes/HealthRoute.js` (line 17)
* **Code:**
  ```js
  router.get('/', async (req, res) => {
    await healthController(req, res); // `next` is omitted
  });
  ```
* **Root Cause & Impact:** In `HealthController.js`, `healthController(req, res, next)` expects `next`. When an error is caught in the controller, it invokes `httpError(next, error, req, 500)`, which calls `nextFunc(errorObj)`. Since `next` is `undefined`, it throws `TypeError: nextFunc is not a function`, crashing unhandled instead of delegating to the Express error pipeline.
* **Fix:** Pass controller directly `router.get('/', healthController);` or pass `(req, res, next) => healthController(req, res, next)`.

---

### 2.4 Inverted Error Response Structure in `globalErrorHandler` (`cjs` & `esm-js`) (P1)
* **Files:** `cjs/src/middlewares/globalErrorHandler.js` (lines 7–13), `esm-js/src/middlewares/globalErrorHandler.js` (line 7)
* **Code:**
  ```js
  httpResponse(req, res, err.statusCode, responseMessages.SOMETHING_WENT_WRONG, err);
  ```
* **Root Cause & Impact:** `httpResponse` is the utility for **successful** controller responses and hardcodes `"success": true` and logs `"CONTROLLER_RESPONSE"`. When `globalErrorHandler` uses it to send errors, the client receives an HTTP error status code (e.g. 500) with a JSON body stating `"success": true` and nesting the real error under `data`:
  ```json
  {
    "success": true,
    "statusCode": 500,
    "message": "Something went wrong!",
    "data": { "success": false, "statusCode": 500, ... }
  }
  ```
* **Fix:** Send the formatted error directly via `res.status(err.statusCode || 500).json(err)` or use a dedicated `sendErrorResponse` helper.

---

### 2.5 `globalErrorHandler` in `esm-ts` Crashes on Standard/Unhandled Errors (P1)
* **File:** `esm-ts/src/middleware/globalErrorHandler.ts` (lines 5–7)
* **Code:**
  ```ts
  export default (err: THttpError, _: Request, res: Response, __: NextFunction) => {
    res.status(err.statusCode).json(err);
  };
  ```
* **Root Cause & Impact:**
  1. Standard JavaScript errors (syntax errors, database errors, unhandled exceptions) do not have a `statusCode` property. `res.status(undefined)` causes Express to throw `RangeError: The status code must be a number`.
  2. In JavaScript, standard `Error` properties (`message`, `stack`) are non-enumerable. `res.json(new Error('...'))` serializes to `{}` (empty JSON object).
* **Fix:** Normalize incoming errors in `globalErrorHandler` to ensure a default status code (500) and structured response payload.

---

### 2.6 Request-Hanging Bug in `esm-ts/src/middleware/rateLimit.ts` (P1)
* **File:** `esm-ts/src/middleware/rateLimit.ts` (lines 13–22)
* **Code:**
  ```ts
  if (rateLimiterMongo) {
    rateLimiterMongo.consume(...)
  }
  // If rateLimiterMongo is null, next() is NEVER called!
  ```
* **Root Cause & Impact:** If `rateLimiterMongo` is `null` (e.g. during server startup before MongoDB connects, if DB connection fails, or if running in an environment without DB), the middleware finishes without invoking `next()`. The client request hangs indefinitely until connection timeout.
* **Fix:** Add fallback `else { return next(); }` or handle memory-store rate limiting when MongoDB store is unavailable.

---

### 2.7 Winston File Transport Drops Metadata in `esm-ts` (P1)
* **File:** `esm-ts/src/utils/logger.ts` (lines 61–76)
* **Code:**
  ```ts
  const fileLogFormat = format.printf((info) => {
    const { level, message, timestamp } = info;
    const logMeta: Record<string, unknown> = {}; // Hardcoded empty!
    const logData = { level: level.toUpperCase(), message, timestamp, meta: logMeta };
    return JSON.stringify(logData, null, 4);
  });
  ```
* **Root Cause & Impact:** `info.meta` is completely ignored and dropped. All log metadata (request details, error stack traces, database metrics) is lost in file logs.
* **Fix:** Extract and use `info.meta` in `logData.meta = info.meta || {}`.

---

### 2.8 Deprecated Placeholder Download in `esm-ts/package.json` Build Script (P1)
* **File:** `esm-ts/package.json` (line 9)
* **Code:** `"build": "npx tsc"`
* **Root Cause & Impact:** Running `npx tsc` downloads the deprecated placeholder package `tsc@2.0.4` from npm instead of using the local TypeScript compiler binary.
* **Fix:** Change to `"build": "tsc"`.

---

### 2.9 Invalid `commitlint.config.js` in `esm-ts` (P1)
* **File:** `esm-ts/commitlint.config.js` (line 2)
* **Code:** `extends: ['@commitlint/cli', '@commitlint/config-conventional']`
* **Root Cause & Impact:** `@commitlint/cli` is the command-line binary, not a shareable config. Extending it throws a configuration resolution error when commitlint runs.
* **Fix:** Use `extends: ['@commitlint/config-conventional']`.

---

### 2.10 Invalid Option in `express.json()` (`cjs` & `esm-js`) (P2)
* **Files:** `cjs/src/Server.js` (line 30), `esm-js/src/Server.js` (line 30)
* **Code:** `api.use(express.json({ limit: '10mb', extended: true }));`
* **Root Cause & Impact:** `extended: true` is an option for `express.urlencoded()`, not `express.json()`.
* **Fix:** Remove `extended: true` from `express.json()`.

---

## 3. Security Vulnerabilities & Risks

### 3.1 Invalid & Insecure CORS Configuration with Credentials
* **Files:** `cjs/src/Server.js` (lines 31–36), `esm-js/src/Server.js` (lines 31–36), `esm-ts/src/Server.ts` (lines 31–36)
* **Risk:**
  ```js
  cors({
    origin: ['*'],
    credentials: true,
  })
  ```
  - Browsers reject CORS responses when `Access-Control-Allow-Credentials: true` is combined with wildcard origins (`*`).
  - Passing `['*']` as an array literally checks for `req.header('Origin') === '*'`.
* **Fix:** Make `cors` origin configurable via environment variable (`ALLOWED_ORIGINS` / `CORS_ORIGIN`), allowing specific trusted origins when `credentials: true`.

---

### 3.2 Inconsistent & Flawed Authorization Middleware (`Auth.middleware.js`)
* **Files:** `cjs/src/middlewares/Auth.middleware.js`, `esm-js/src/middlewares/Auth.middleware.js`
* **Risks:**
  1. **Header Inconsistency:** `isAuthorized` checks `Authorization: Bearer <token>`, while `isAdmin` expects `x-auth-token: <token>`.
  2. **Redundant & Broken Admin Verification:** `isAdmin` attempts to verify a raw token from `x-auth-token` instead of inspecting `req.user` populated by `isAuthorized`.
  3. **Direct `process.env` access:** Reads `process.env.ATK_SECRET` rather than centralized `config.secret`.
  4. **Incorrect HTTP Status:** Returns `401 Unauthorized` for role/permission failure instead of `403 Forbidden`.
  5. **Broken Preflight Intercept in `allowCrossDomain`:** Manually sets CORS headers and calls `next()` on `OPTIONS`, conflicting with Express `cors()` middleware.

---

### 3.3 Event-Loop-Blocking Synchronous Bcrypt Hashing
* **Files:** `cjs/src/utils/utils.js` (lines 3–9), `esm-js/src/utils/utils.js` (lines 3–9)
* **Risk:** `bcrypt.hashSync` and `bcrypt.compareSync` block the Node.js event loop synchronously for 50–100ms per call. Under concurrent load, multiple login/registration requests freeze the entire server.
* **Fix:** Use asynchronous hashing: `await bcrypt.hash(password, 10)` and `await bcrypt.compare(password, hash)`.

---

### 3.4 Database Error Swallowing & Startup Race Condition
* **Files:** `cjs/src/database/DataBaseController.js`, `esm-js/src/database/DataBaseController.js`, `cjs/src/Server.js:L83`, `esm-js/src/Server.js:L83`
* **Risk:**
  - `connectMongodb` catches errors and returns `false`, swallowing the exception.
  - In `Server.js`, `this.httpServer.listen` starts accepting HTTP traffic *before* `connectMongodb` finishes connecting. Incoming requests immediately fail due to disconnected database states.
* **Fix:** Connect to the database prior to starting the HTTP listener:
  ```js
  await connectMongodb(this.options.db_url);
  this.httpServer.listen(this.options.port, ...);
  ```

---

## 4. Cross-Template Inconsistencies & Architecture Discrepancies

| Feature / Pattern | `cjs` | `esm-js` | `esm-ts` | Recommended Standard |
|---|---|---|---|---|
| **Module System** | CommonJS (`require`) | ESM (`import`) | Configured as CommonJS (`"module": "CommonJS"` in tsconfig, lacks `"type": "module"`) | True ESM (`"module": "NodeNext"`, `"type": "module"`) |
| **Folder Naming** | Plural (`controllers`, `middlewares`, `routes`, `models`) | Plural (`controllers`, `middlewares`, `routes`, `models`) | Singular (`controller`, `middleware`, `router`, `model`) | Standardize to Plural (`controllers`, `middlewares`, `routes`, `models`) |
| **File Casing** | PascalCase (`HealthRoute.js`, `DataBaseController.js`) | PascalCase (`HealthRoute.js`, `DataBaseController.js`) | camelCase (`healthRoute.ts`, `databaseService.ts`) | Standardize across monorepo (`camelCase` for instances/routes/controllers, `PascalCase` for classes) |
| **API Versioning** | `/api/health` | `/api/health` | `/api/v1/health` | Standardize to `/api/v1/health` |
| **Swagger API Docs** | Configured at `/api/docs` | Configured at `/api/docs` | Completely Missing | Add Swagger UI OpenAPI to `esm-ts` |
| **Rate Limiter** | Missing | Missing | Configured in `rateLimiter.ts`, but not used in router | Standardize rate-limiter middleware across all templates |
| **Graceful Shutdown** | Present (includes `SIGTSTP`) | Present (includes `SIGTSTP`) | Missing completely | Implement unified shutdown (SIGINT/SIGTERM, closing HTTP + MongoDB) |
| **Environment Variable** | `ENV=development` in `.env`, reads `ENV` | `ENV=development` in `.env`, reads `ENV` | `ENV=development` in `.env`, reads `ENV` | Standardize on industry-standard `NODE_ENV` |
| **Docker Support** | Missing | Missing | Empty 0-byte `Dockerfile` | Provide production multi-stage `Dockerfile` and `docker-compose.yml` |
| **License / Changelog** | Has `LICENSE` and `CHANGELOG.md` | Has `LICENSE` and `CHANGELOG.md` | Missing both | Include `LICENSE` and `CHANGELOG.md` in `esm-ts` |
| **Husky `prepare` script** | `"husky install"` (legacy) | `"husky install"` (legacy) | `"husky"` (modern v9) | Standardize on `"prepare": "husky"` |
| **Commitlint** | Missing | Missing | Configured, but missing `.husky/commit-msg` hook | Provide commitlint in all templates with git hook |

---

## 5. Code Quality, Types & DX Issues

1. **Console Logging Disabled in Production**:
   - In `esm-ts/src/utils/logger.ts`, `consoleTransport()` returns `[]` in production.
   - In modern cloud/container platforms (Kubernetes, AWS ECS, GCP Cloud Run, Docker), logs must be output to `stdout`/`stderr` for log collector agents. File-only logging in containers causes logs to be lost upon container restart.
   - File logs output multi-line pretty-printed JSON (`JSON.stringify(..., null, 4)`), which breaks NDJSON (Newline Delimited JSON) ingestion pipelines.

2. **Typo in TypeScript Definition**:
   - `esm-ts/src/types/index.ts` (line 37): `InfoType` defines `mta: object;` instead of `meta: object;`.

3. **Useless Catch-Rethrow & Disabled ESLint Rule**:
   - In `esm-ts/src/database/databaseService.ts` (lines 23–25): `try { ... } catch (err) { throw err; }` does nothing.
   - In `esm-ts/eslint.config.mjs`: `'no-useless-catch': 0` was disabled to bypass this warning.

4. **Unused Dependencies in `esm-ts/package.json`**:
   - `winston-mongodb` and `ts-migrate-mongoose` are installed in `dependencies` but never configured or used.

5. **`SIGTSTP` Signal Misuse in Graceful Shutdown**:
   - `SIGTSTP` (Ctrl+Z) is the terminal suspend signal. Overriding it with `process.exit(0)` prevents developers from suspending processes in Unix shells.

6. **ESLint & Prettier Plugin Disconnect (`cjs` & `esm-js`)**:
   - `eslint-plugin-security`, `eslint-config-prettier`, and `eslint-plugin-prettier` are installed in `devDependencies` but omitted from `eslint.config.mjs`.

7. **Documentation Discrepancies**:
   - `cjs/README.md` and `esm-js/README.md` list `MONGO_URL` in the config table, but code and `.env.example` use `DATABASE_URL`.
   - `cjs/README.md` lists `.eslintrc.js`, but the project uses `eslint.config.mjs`.
   - `package.json` lists `"license": "ISC"`, while `README.md` and `LICENSE` state `MIT`.

---

## 6. Recommended Upgrades & Modernization Roadmap

### Phase 1: High Priority (Bug Fixes & Parity)
- [x] **Fix Logger Paths:** Update `esm-js` logger to use absolute path resolution and preserve metadata in `esm-ts`.
- [x] **Fix Error Handling:** Standardize `globalErrorHandler` to send structured `{ success: false, statusCode, message, errors?, trace? }` responses across all three templates.
- [x] **Clean Dependencies:** Add `jsonwebtoken` and `bcryptjs` (or remove unused middleware/utils), and remove unused `winston-mongodb` / `ts-migrate-mongoose`.
- [x] **Fix Build & Scripts:** Update `esm-ts` build script to `"build": "tsc"`, fix `commitlint.config.js`, and standardize `"prepare": "husky"`.
- [x] **Fix Route Controllers:** Pass `next` properly to route handlers in `cjs` and `esm-js`.

### Phase 2: Structural Standardization
- [x] **Folder Structure:** Standardize on plural directory names (`controllers`, `middlewares`, `routes`, `models`) and consistent file casing.
- [x] **API Versioning:** Standardize all templates to use `/api/v1/health`.
- [x] **Feature Parity:** Add Swagger OpenAPI documentation to `esm-ts` and integrate Rate Limiter middleware across `cjs` and `esm-js`.
- [x] **Unified Env Management:** Standardize on `NODE_ENV` and `DATABASE_URL` across all templates and docs.

### Phase 3: Modern Tooling & Enhancements
- [x] **True ESM in TypeScript:** Configure `esm-ts` for NodeNext ESM (`"module": "NodeNext"`, `"moduleResolution": "NodeNext"`, `"type": "module"`).
- [x] **Modern Dev Server:** Adopt `tsx` (`"dev": "tsx watch src/index.ts"`) for ultra-fast TypeScript compilation without `ts-node`/`nodemon` overhead.
- [x] **Standardized Graceful Shutdown:** Implemented sequential startup (`await db.connect()` -> `httpServer.listen()`) and clean teardown (closing HTTP connections and `mongoose.disconnect()`).
- [x] **Docker & Compose:** Provide multi-stage Dockerfiles and `docker-compose.yml` (app + MongoDB) for all templates.
- [x] **Automated Testing & CI:** Add Vitest/Jest + Supertest with health check integration tests, and add a root GitHub Actions workflow for CI verification.
