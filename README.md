# create-mexn-app-templates

This repository is a monorepo containing all the templates used by the npm package `create-mexn-app`. It includes templates for CommonJS (CJS), ECMAScript Modules (ESM), and TypeScript with Native ESM (ESM-TS).

## Directory Structure

```
└── create-mexn-app-templates/
    ├── .github/
    │   └── workflows/
    │       └── ci.yml
    ├── cjs/
    │   ├── logs/
    │   ├── src/
    │   │   ├── config/
    │   │   │   ├── index.js
    │   │   │   ├── rateLimiter.js
    │   │   │   └── swagger.js
    │   │   ├── constants/
    │   │   │   ├── application.js
    │   │   │   └── responseMessages.js
    │   │   ├── controllers/
    │   │   │   └── healthController.js
    │   │   ├── database/
    │   │   │   └── databaseService.js
    │   │   ├── middlewares/
    │   │   │   ├── authMiddleware.js
    │   │   │   ├── globalErrorHandler.js
    │   │   │   └── rateLimit.js
    │   │   ├── models/
    │   │   │   └── .gitkeep
    │   │   ├── routes/
    │   │   │   └── healthRoute.js
    │   │   ├── services/
    │   │   │   └── healthService.js
    │   │   ├── utils/
    │   │   │   ├── common.js
    │   │   │   ├── errorObject.js
    │   │   │   ├── httpError.js
    │   │   │   ├── httpResponse.js
    │   │   │   ├── logger.js
    │   │   │   └── utils.js
    │   │   └── Server.js
    │   ├── tests/
    │   │   └── health.test.js
    │   ├── .dockerignore
    │   ├── .env.example
    │   ├── .gitignore
    │   ├── .prettierrc
    │   ├── docker-compose.yml
    │   ├── Dockerfile
    │   ├── eslint.config.mjs
    │   ├── index.js
    │   ├── package.json
    │   ├── CHANGELOG.md
    │   ├── LICENSE
    │   └── README.md
    ├── esm-js/
    │   ├── logs/
    │   ├── src/
    │   │   ├── config/
    │   │   │   ├── index.js
    │   │   │   ├── rateLimiter.js
    │   │   │   └── swagger.js
    │   │   ├── constants/
    │   │   │   ├── application.js
    │   │   │   └── responseMessages.js
    │   │   ├── controllers/
    │   │   │   └── healthController.js
    │   │   ├── database/
    │   │   │   └── databaseService.js
    │   │   ├── middlewares/
    │   │   │   ├── authMiddleware.js
    │   │   │   ├── globalErrorHandler.js
    │   │   │   └── rateLimit.js
    │   │   ├── models/
    │   │   │   └── .gitkeep
    │   │   ├── routes/
    │   │   │   └── healthRoute.js
    │   │   ├── services/
    │   │   │   └── healthService.js
    │   │   ├── utils/
    │   │   │   ├── common.js
    │   │   │   ├── errorObject.js
    │   │   │   ├── httpError.js
    │   │   │   ├── httpResponse.js
    │   │   │   ├── logger.js
    │   │   │   └── utils.js
    │   │   └── Server.js
    │   ├── tests/
    │   │   └── health.test.js
    │   ├── .dockerignore
    │   ├── .env.example
    │   ├── .gitignore
    │   ├── .prettierrc
    │   ├── docker-compose.yml
    │   ├── Dockerfile
    │   ├── eslint.config.mjs
    │   ├── index.js
    │   ├── package.json
    │   ├── CHANGELOG.md
    │   ├── LICENSE
    │   └── README.md
    └── esm-ts/
        ├── logs/
        ├── src/
        │   ├── config/
        │   │   ├── index.ts
        │   │   ├── rateLimiter.ts
        │   │   └── swagger.ts
        │   ├── constants/
        │   │   ├── application.ts
        │   │   └── responseMessages.ts
        │   ├── controllers/
        │   │   └── healthController.ts
        │   ├── database/
        │   │   └── databaseService.ts
        │   ├── middlewares/
        │   │   ├── globalErrorHandler.ts
        │   │   └── rateLimit.ts
        │   ├── models/
        │   │   └── index.ts
        │   ├── routes/
        │   │   └── healthRoute.ts
        │   ├── services/
        │   │   └── healthService.ts
        │   ├── types/
        │   │   └── index.ts
        │   ├── utils/
        │   │   ├── common.ts
        │   │   ├── errorObject.ts
        │   │   ├── httpError.ts
        │   │   ├── httpResponse.ts
        │   │   └── logger.ts
        │   └── Server.ts
        ├── tests/
        │   └── health.test.ts
        ├── .dockerignore
        ├── .env.example
        ├── .gitignore
        ├── .prettierrc
        ├── commitlint.config.js
        ├── docker-compose.yml
        ├── Dockerfile
        ├── eslint.config.mjs
        ├── index.ts
        ├── package.json
        ├── tsconfig.json
        ├── CHANGELOG.md
        ├── LICENSE
        └── README.md
```

### CommonJS (CJS)

This template is designed for projects using the CommonJS module system with Node.js and Express.

### ECMAScript Modules (ESM)

This template is designed for projects using the standard ECMAScript Modules system.

### TypeScript with ESM (ESM-TS)

This template is designed for projects using TypeScript with native NodeNext ECMAScript Modules and `tsx`.

## Usage

To use these templates with the `create-mexn-app` package, follow the instructions in the `create-mexn-app` documentation.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
