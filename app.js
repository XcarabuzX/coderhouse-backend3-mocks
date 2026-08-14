import 'dotenv/config';
import express from 'express';
import swaggerUiExpress from 'swagger-ui-express';
import { connectDB } from './src/config/mongoose.config.js';
import { swaggerSpecs } from './src/config/swagger.config.js';
import mocksRouter from './src/routes/mocks.router.js';
import usersRouter from './src/routes/users.router.js';
import petsRouter from './src/routes/pets.router.js';
import adoptionRouter from './src/routes/adoption.router.js';

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware para poder leer JSON en el body de las peticiones.
app.use(express.json());

// Conexión a MongoDB.
connectDB();

// Documentación Swagger disponible en /api/docs.
app.use('/api/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(swaggerSpecs));

// Montaje de routers.
app.use('/api/mocks', mocksRouter);
app.use('/api/users', usersRouter);
app.use('/api/pets', petsRouter);
app.use('/api/adoptions', adoptionRouter);

// Solo levantamos el servidor si NO estamos en modo test.
// En los tests importamos "app" y Supertest lo maneja sin abrir un puerto real.
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
}

export default app;
