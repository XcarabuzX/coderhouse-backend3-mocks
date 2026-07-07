import { Router } from 'express';
import { PetModel } from '../models/Pet.model.js';

const router = Router();

// GET /api/pets - Lista todas las mascotas insertadas en la base de datos.
// Sirve para comprobar los registros generados por /generateData.
router.get('/', async (req, res) => {
  try {
    const pets = await PetModel.find();
    res.json({ status: 'success', payload: pets });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

export default router;
