import swaggerJSDoc from 'swagger-jsdoc';

// Configuración base de OpenAPI. swagger-jsdoc lee los comentarios @swagger
// que escribamos en los archivos indicados en "apis" y arma la documentación.
const swaggerOptions = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'AdoptMe API - Backend 3',
      version: '1.0.0',
      description: 'Documentación de la API del proyecto final (Users, Pets, Adopciones y Mocks).'
    }
  },
  apis: ['./src/routes/*.js'] // dónde buscar los comentarios @swagger
};

export const swaggerSpecs = swaggerJSDoc(swaggerOptions);
