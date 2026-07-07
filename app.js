import express from 'express';
import { connectDB } from './src/config/mongoose.config.js';
import mocksRouter from './src/routes/mocks.router.js';
import usersRouter from './src/routes/users.router.js';
import petsRouter from './src/routes/pets.router.js';

const app = express();
const PORT = 8080;

// Middleware para poder leer JSON en el body de las peticiones.
app.use(express.json());

// Conexión a MongoDB.
connectDB();

// Montaje de routers.
app.use('/api/mocks', mocksRouter);
app.use('/api/users', usersRouter);
app.use('/api/pets', petsRouter);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
