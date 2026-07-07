import { Router } from 'express';
import { UserModel } from '../models/User.model.js';

const router = Router();

// GET /api/users - Lista todos los usuarios insertados en la base de datos.
// Sirve para comprobar los registros generados por /generateData.
router.get('/', async (req, res) => {
  try {
    const users = await UserModel.find();
    res.json({ status: 'success', payload: users });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

export default router;
