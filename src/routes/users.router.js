import { Router } from 'express';
import { UserModel } from '../models/User.model.js';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Id autogenerado de MongoDB
 *           example: 652f1c2e8b3a4d1a2c3e4f56
 *         first_name:
 *           type: string
 *           example: Juan
 *         last_name:
 *           type: string
 *           example: Pérez
 *         email:
 *           type: string
 *           example: juan.perez@example.com
 *         password:
 *           type: string
 *           description: Contraseña encriptada con bcrypt
 *         role:
 *           type: string
 *           enum: [user, admin]
 *           example: user
 *         pets:
 *           type: array
 *           description: Mascotas adoptadas por el usuario
 *           items:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *                 example: 652f1c2e8b3a4d1a2c3e4f77
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestión de usuarios
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Lista todos los usuarios
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 payload:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       500:
 *         description: Error interno del servidor
 */
router.get('/', async (req, res) => {
  try {
    const users = await UserModel.find();
    res.json({ status: 'success', payload: users });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

export default router;
