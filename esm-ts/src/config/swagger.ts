import swaggerJsDoc from 'swagger-jsdoc';
import config from './index.js';

const options: swaggerJsDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Node API',
      description: 'API endpoints documentation',
      contact: {
        name: '',
        email: '',
        url: ''
      },
      version: '1.0.0'
    },
    servers: [
      {
        url: config.server_url || 'http://localhost:8000',
        description: config.env || 'development'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['src/routes/*.ts', 'dist/src/routes/*.js', 'routes/*.ts']
};

const swaggerSpec = swaggerJsDoc(options);

export { swaggerSpec };
