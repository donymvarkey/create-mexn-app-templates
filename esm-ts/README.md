# Node.js Server Boilerplate (TypeScript + ESM)

## Overview

A robust, type-safe boilerplate for building scalable, production-ready REST APIs with Node.js, Express, MongoDB (Mongoose), and TypeScript with native NodeNext ECMAScript Modules (ESM).

## Features

- **TypeScript & Native ESM:** Full static typing with `"module": "NodeNext"` and source maps
- **Dev Runner:** Ultra-fast development server powered by `tsx watch`
- **API Framework:** Express.js with Helmet security headers and CORS
- **Database:** MongoDB integration via Mongoose with clean connection lifecycle
- **API Documentation:** Built-in Swagger OpenAPI 3.0 docs at `/api/docs`
- **Rate Limiting:** MongoDB-backed rate limiting using `rate-limiter-flexible`
- **Logging:** Structured Winston logger with environment-tailored formatting (colors for dev, JSON for prod)
- **Error Handling:** Standardized error envelopes and centralized global error handling
- **Testing:** Automated integration tests with Vitest and Supertest
- **Docker & Compose:** Production-ready multi-stage Dockerfile and Docker Compose with MongoDB service
- **Linting & Formatting:** ESLint with `typescript-eslint` and Prettier
- **Git Hooks & Commitlint:** Husky pre-commit hooks and conventional commit linting

## Directory Structure

```
esm-ts/
├── logs/                      # Application log files
├── src/
│   ├── config/                # Centralized configuration
│   │   ├── index.ts           # Environment configuration
│   │   ├── rateLimiter.ts     # Rate limiter setup
│   │   └── swagger.ts         # Swagger OpenAPI definition
│   ├── constants/             # Application constants
│   │   ├── application.ts     # Environment enums
│   │   └── responseMessages.ts# Standard response messages
│   ├── controllers/           # Route controllers
│   │   └── healthController.ts# Health check controller
│   ├── database/              # Database connection & services
│   │   └── databaseService.ts # MongoDB connection handler
│   ├── middlewares/           # Custom Express middlewares
│   │   ├── globalErrorHandler.ts # Global error handler
│   │   └── rateLimit.ts       # Rate limiting middleware
│   ├── models/                # Mongoose database models
│   │   └── index.ts
│   ├── routes/                # API route definitions
│   │   └── healthRoute.ts     # /api/v1/health endpoint
│   ├── services/              # Business logic services
│   │   └── healthService.ts   # Health check metrics service
│   ├── types/                 # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/                 # Utility helpers
│   │   ├── common.ts          # System/App metrics helpers
│   │   ├── errorObject.ts     # Standard error formatter
│   │   ├── httpError.ts       # HTTP error helper
│   │   ├── httpResponse.ts    # Standard success response formatter
│   │   └── logger.ts          # Winston logger instance
│   └── Server.ts              # Express HTTP server setup & lifecycle
├── tests/                     # Integration tests
│   └── health.test.ts         # Health route test suite
├── .dockerignore              # Docker ignore rules
├── .env.example               # Environment variables template
├── .gitignore                 # Git ignore rules
├── .prettierrc                # Prettier code formatting rules
├── commitlint.config.js       # Commitlint conventional config
├── docker-compose.yml         # Local Docker Compose environment
├── Dockerfile                 # Production multi-stage Docker build
├── eslint.config.mjs          # ESLint flat configuration
├── index.ts                   # Application entry point
├── package.json               # NPM package manifest
├── tsconfig.json              # TypeScript compiler configuration
├── CHANGELOG.md               # Version changelog
├── LICENSE                    # MIT License
└── README.md                  # Project documentation
```

## Scripts

- **Development Mode (with auto-reload):**
  ```bash
  npm run dev
  ```
- **Build TypeScript:**
  ```bash
  npm run build
  ```
- **Production Mode:**
  ```bash
  npm start
  ```
- **Run Tests:**
  ```bash
  npm test
  ```
- **Linting:**
  ```bash
  npm run lint
  npm run lint:fix
  ```
- **Formatting:**
  ```bash
  npm run format:check
  npm run format:fix
  ```

## Docker

- **Run with Docker Compose (App + MongoDB):**
  ```bash
  docker compose up -d --build
  ```
- **Stop Containers:**
  ```bash
  docker compose down
  ```

## Configuration

| Variable       | Description                                            | Default / Example                  |
| :------------- | :----------------------------------------------------- | :--------------------------------- |
| `NODE_ENV`     | Application environment (`development` / `production`) | `development`                      |
| `PORT`         | Server listening port                                  | `8000`                             |
| `SERVER_URL`   | Base URL of the API server                             | `http://localhost:8000`            |
| `SECRET`       | Secret key for signing and verifying JWT tokens        | `super_secret_key`                 |
| `DATABASE_URL` | MongoDB connection URI string                          | `mongodb://localhost:27017/dbname` |

## API Endpoints

- **Health Check:** `GET /api/v1/health`
- **Swagger Documentation:** `GET /api/docs`

## License

This project is licensed under the MIT License. See [LICENSE](file:///Users/donymvarkey/Projects/create-mexn-app-templates/esm-ts/LICENSE) for details.
