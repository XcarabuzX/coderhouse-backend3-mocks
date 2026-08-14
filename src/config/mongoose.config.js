import mongoose from 'mongoose';

// La URL viene de la variable de entorno MONGO_URL (útil para Docker/tests).
// Si no existe, usa la base local por defecto.
const MONGODB_URI =
  process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/mocks?directConnection=true';

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB conectado');
  } catch (error) {
    console.error('Error conectando a MongoDB:', error.message);
    process.exit(1);
  }
};
