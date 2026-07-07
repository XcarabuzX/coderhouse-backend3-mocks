import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

// Encripta una contraseña con bcrypt (mismo patrón que usa CoderHouse).
export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

// Genera UN usuario con el formato de un documento de Mongo.
// - password: "coder123" SIEMPRE encriptada.
// - role: varía aleatoriamente entre "user" y "admin".
// - pets: array vacío.
export const generateUser = () => ({
  _id: new mongoose.Types.ObjectId(),
  first_name: faker.person.firstName(),
  last_name: faker.person.lastName(),
  email: faker.internet.email(),
  password: createHash('coder123'),
  role: faker.helpers.arrayElement(['user', 'admin']),
  pets: []
});

// Genera un array de "qty" usuarios.
export const generateUsers = (qty) =>
  Array.from({ length: qty }, () => generateUser());

// Genera UNA mascota con formato de documento de Mongo.
export const generatePet = () => ({
  _id: new mongoose.Types.ObjectId(),
  name: faker.animal.petName(),
  specie: faker.animal.type(),
  birthDate: faker.date.past({ years: 10 }),
  adopted: false,
  image: faker.image.urlLoremFlickr({ category: 'animals' })
});

// Genera un array de "qty" mascotas.
export const generatePets = (qty) =>
  Array.from({ length: qty }, () => generatePet());
