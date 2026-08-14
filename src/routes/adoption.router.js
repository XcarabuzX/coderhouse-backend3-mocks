import { Router } from 'express';
import mongoose from 'mongoose';
import { AdoptionModel } from '../models/Adoption.model.js';
import { UserModel } from '../models/User.model.js';
import { PetModel } from '../models/Pet.model.js';

const router = Router();

// GET /api/adoptions - Lista todas las adopciones.
router.get('/', async (req, res) => {
  try {
    const adoptions = await AdoptionModel.find();
    res.json({ status: 'success', payload: adoptions });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
});

// GET /api/adoptions/:aid - Devuelve una adopción por su id.
router.get('/:aid', async (req, res) => {
  try {
    const { aid } = req.params;

    // Si el id no tiene formato válido de Mongo, no vale la pena buscar.
    if (!mongoose.isValidObjectId(aid)) {
      return res.status(400).json({ status: 'error', error: 'Invalid adoption id' });
    }

    const adoption = await AdoptionModel.findById(aid);
    if (!adoption) {
      return res.status(404).json({ status: 'error', error: 'Adoption not found' });
    }

    res.json({ status: 'success', payload: adoption });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
});

// POST /api/adoptions/:uid/:pid - El usuario uid adopta la mascota pid.
router.post('/:uid/:pid', async (req, res) => {
  try {
    const { uid, pid } = req.params;

    if (!mongoose.isValidObjectId(uid) || !mongoose.isValidObjectId(pid)) {
      return res.status(400).json({ status: 'error', error: 'Invalid user or pet id' });
    }

    // 1) El usuario debe existir.
    const user = await UserModel.findById(uid);
    if (!user) {
      return res.status(404).json({ status: 'error', error: 'User not found' });
    }

    // 2) La mascota debe existir.
    const pet = await PetModel.findById(pid);
    if (!pet) {
      return res.status(404).json({ status: 'error', error: 'Pet not found' });
    }

    // 3) La mascota no debe estar ya adoptada.
    if (pet.adopted) {
      return res.status(400).json({ status: 'error', error: 'Pet is already adopted' });
    }

    // 4) Actualizamos los tres documentos.
    user.pets.push({ _id: pet._id });
    await user.save();

    pet.adopted = true;
    pet.owner = user._id;
    await pet.save();

    const adoption = await AdoptionModel.create({ owner: user._id, pet: pet._id });

    res.status(201).json({ status: 'success', payload: adoption });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
});

export default router;
