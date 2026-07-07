import { Router } from 'express';
import { UserModel } from '../models/User.model.js';
import { PetModel } from '../models/Pet.model.js';
import { generateUsers, generatePets } from '../mocks/mocking.module.js';

const router = Router();

// GET /api/mocks/mockingpets
// Endpoint migrado del primer Desafío Entregable.
// Genera mascotas falsas (sin insertarlas en la base de datos).
router.get('/mockingpets', (req, res) => {
  try {
    const quantity = Number(req.query.quantity) || 100;
    const pets = generatePets(quantity);
    res.json({ status: 'success', payload: pets });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// GET /api/mocks/mockingusers
// Genera 50 usuarios con el formato que entregaría una petición de Mongo
// (password encriptada, role variable, pets vacío). No los inserta.
router.get('/mockingusers', (req, res) => {
  try {
    const users = generateUsers(50);
    res.json({ status: 'success', payload: users });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// POST /api/mocks/generateData
// Recibe los parámetros numéricos "users" y "pets" y genera e inserta
// esa cantidad de registros en la base de datos.
router.post('/generateData', async (req, res) => {
  try {
    const usersQty = Number(req.body.users) || 0;
    const petsQty = Number(req.body.pets) || 0;

    if (usersQty <= 0 && petsQty <= 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Envía al menos "users" o "pets" como número mayor que 0.'
      });
    }

    // Generamos los datos. Quitamos el _id falso para que Mongo asigne el real.
    const usersToInsert = generateUsers(usersQty).map(({ _id, ...user }) => user);
    const petsToInsert = generatePets(petsQty).map(({ _id, ...pet }) => pet);

    const insertedUsers = usersToInsert.length
      ? await UserModel.insertMany(usersToInsert)
      : [];
    const insertedPets = petsToInsert.length
      ? await PetModel.insertMany(petsToInsert)
      : [];

    res.status(201).json({
      status: 'success',
      message: 'Datos generados e insertados correctamente.',
      insertedUsers: insertedUsers.length,
      insertedPets: insertedPets.length
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

export default router;
