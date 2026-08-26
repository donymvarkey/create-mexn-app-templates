# Node.js Server Boilerplate (CommonJS)

## Overview

A robust boilerplate for building scalable, production-ready REST APIs with Node.js, Express, MongoDB (Mongoose), and CommonJS.

## Features

- **Module System:** CommonJS (`require` / `module.exports`)
- **API Framework:** Express.js with Helmet security headers and CORS
- **Database:** MongoDB integration via Mongoose with clean connection lifecycle
- **API Documentation:** Built-in Swagger OpenAPI 3.0 docs at `/api/docs`
- **Rate Limiting:** MongoDB-backed rate limiting using `rate-limiter-flexible`
- **Logging:** Structured Winston logger with environment-tailored formatting (colors for dev, JSON for prod)
- **Error Handling:** Standardized error envelopes and centralized global error handling
- **Testing:** Automated integration tests with Node native test runner and Supertest
- **Docker & Compose:** Production-ready multi-stage Dockerfile and Docker Compose with MongoDB service
- **Linting & Formatting:** ESLint flat config (`eslint.config.mjs`) and Prettier
- **Git Hooks:** Husky pre-commit hooks

## Directory Structure

```
cjs/
├── logs/                      # Application log files
├── src/
│   ├── config/                # Centralized configuration
│   │   ├── index.js           # Environment configuration
│   │   ├── rateLimiter.js     # Rate limiter setup
│   │   └── swagger.js         # Swagger OpenAPI definition
│   ├── constants/             # Application constants
│   │   ├── application.js     # Environment enums
│   │   └── responseMessages.js# Standard response messages
│   ├── controllers/           # Route controllers
│   │   └── healthController.js# Health check controller
│   ├── database/              # Database connection & services
│   │   └── databaseService.js # MongoDB connection handler
│   ├── middlewares/           # Custom Express middlewares
│   │   ├── authMiddleware.js  # JWT authentication & authorization
│   │   ├── globalErrorHandler.js # Global error handler
│   │   └── rateLimit.js       # Rate limiting middleware
│   ├── models/                # Mongoose database models
│   ├── routes/                # API route definitions
│   │   └── healthRoute.js     # /api/v1/health endpoint
│   ├── services/              # Business logic services
│   │   └── healthService.js   # Health check metrics service
│   ├── utils/                 # Utility helpers
│   │   ├── common.js          # System/App metrics helpers
│   │   ├── errorObject.js     # Standard error formatter
│   │   ├── httpError.js       # HTTP error helper
│   │   ├── httpResponse.js    # Standard success response formatter
│   │   ├── logger.js          # Winston logger instance
│   │   └── utils.js           # Password & pagination helpers
│   └── Server.js              # Express HTTP server setup & lifecycle
├── tests/                     # Integration tests
│   └── health.test.js         # Health route test suite
├── .dockerignore              # Docker ignore rules
├── .env.example               # Environment variables template
├── .gitignore                 # Git ignore rules
├── .prettierrc                # Prettier code formatting rules
├── docker-compose.yml         # Local Docker Compose environment
├── Dockerfile                 # Production multi-stage Docker build
├── eslint.config.mjs          # ESLint flat configuration
├── index.js                   # Application entry point
├── package.json               # NPM package manifest
├── CHANGELOG.md               # Version changelog
├── LICENSE                    # MIT License
└── README.md                  # Project documentation
```

## Scripts

- **Development Mode (with auto-reload):**
  ```bash
  npm run dev
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
  npm run format
  npm run format:check
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

This project is licensed under the MIT License. See [LICENSE](file:///Users/donymvarkey/Projects/create-mexn-app-templates/cjs/LICENSE) for details.
