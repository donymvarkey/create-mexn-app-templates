# create-mexn-app-templates

This repository is a monorepo containing all the templates used by the npm package `create-mexn-app`. It includes templates for CommonJS (CJS), ECMAScript Modules (ESM), and TypeScript with ESM (ESM-TS).

## Directory Structure

Directory structure:

```
└── create-mexn-app-templates/
├── cjs/
│ ├── README.md
│ ├── CHANGELOG.md
│ ├── LICENSE
│ ├── eslint.config.mjs
│ ├── index.js
│ ├── package-lock.json
│ ├── package.json
│ ├── .env.example
│ ├── .gitignore
│ ├── .prettierrc
│ ├── src/
│ │ ├── Server.js
│ │ ├── config/
│ │ │ ├── Swagger.js
│ │ │ └── index.js
│ │ ├── constants/
│ │ │ ├── application.js
│ │ │ └── responseMessages.js
│ │ ├── controllers/
│ │ │ └── HealthController.js
│ │ ├── database/
│ │ │ └── DataBaseController.js
│ │ ├── middlewares/
│ │ │ ├── Auth.middleware.js
│ │ │ └── globalErrorHandler.js
│ │ ├── models/
│ │ │ └── .gitkeep
│ │ ├── routes/
│ │ │ └── HealthRoute.js
│ │ ├── services/
│ │ │ └── HealthService.js
│ │ └── utils/
│ │ ├── common.js
│ │ ├── errorObject.js
│ │ ├── httpError.js
│ │ ├── httpResponse.js
│ │ ├── logger.js
│ │ └── utils.js
│ └── .husky/
│ └── pre-commit
├── esm-js/
│ ├── README.md
│ ├── CHANGELOG.md
│ ├── LICENSE
│ ├── eslint.config.mjs
│ ├── index.js
│ ├── package-lock.json
│ ├── package.json
│ ├── .env.example
│ ├── .gitignore
│ ├── .prettierrc
│ ├── src/
│ │ ├── Server.js
│ │ ├── config/
│ │ │ ├── Swagger.js
│ │ │ └── index.js
│ │ ├── constants/
│ │ │ ├── application.js
│ │ │ └── responseMessages.js
│ │ ├── controllers/
│ │ │ └── HealthController.js
│ │ ├── database/
│ │ │ └── DataBaseController.js
│ │ ├── middlewares/
│ │ │ ├── Auth.middleware.js
│ │ │ └── globalErrorHandler.js
│ │ ├── models/
│ │ │ └── .gitkeep
│ │ ├── routes/
│ │ │ └── HealthRoute.js
│ │ ├── services/
│ │ │ └── HealthService.js
│ │ └── utils/
│ │ ├── common.js
│ │ ├── errorObject.js
│ │ ├── httpError.js
│ │ ├── httpResponse.js
│ │ ├── logger.js
│ │ └── utils.js
│ └── .husky/
│ └── pre-commit
└── esm-ts/
├── README.md
├── commitlint.config.js
├── eslint.config.mjs
├── index.ts
├── nodemon.json
├── package-lock.json
├── package.json
├── tsconfig.json
├── .env.example
├── .gitignore
├── .prettierrc
├── docker/
│ └── Dockerfile
├── src/
│ ├── Server.ts
│ ├── config/
│ │ ├── index.ts
│ │ └── rateLimiter.ts
│ ├── constants/
│ │ ├── application.ts
│ │ └── responseMessage.ts
│ ├── controller/
│ │ └── healthController.ts
│ ├── database/
│ │ └── databaseService.ts
│ ├── middleware/
│ │ ├── globalErrorHandler.ts
│ │ └── rateLimit.ts
│ ├── model/
│ │ └── index.ts
│ ├── router/
│ │ └── healthRoute.ts
│ ├── services/
│ │ └── healthService.ts
│ ├── types/
│ │ └── index.ts
│ └── utils/
│ ├── common.ts
│ ├── errorObject.ts
│ ├── httpError.ts
│ ├── httpResponse.ts
│ └── logger.ts
└── .husky/
└── pre-commit
```

### CommonJS (CJS)

This template is designed for projects using the CommonJS module system.

### ECMAScript Modules (ESM)

This template is designed for projects using the ECMAScript Modules system.

### TypeScript with ESM (ESM-TS)

This template is designed for projects using TypeScript with ECMAScript Modules.

## Usage

To use these templates with the `create-mexn-app` package, follow the instructions in the `create-mexn-app` documentation.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
