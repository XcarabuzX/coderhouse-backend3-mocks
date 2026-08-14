import { expect } from 'chai';
import supertest from 'supertest';
import mongoose from 'mongoose';
import app from '../app.js';
import { UserModel } from '../src/models/User.model.js';
import { PetModel } from '../src/models/Pet.model.js';
import { AdoptionModel } from '../src/models/Adoption.model.js';

// requester envuelve nuestra app de Express para hacerle peticiones HTTP reales.
const requester = supertest(app);

describe('Tests funcionales del router adoption.router.js', function () {
  let userId;      // usuario de prueba
  let petId;       // mascota de prueba (sin adoptar)
  let adoptionId;  // se llena al crear una adopción

  // Antes de todo: esperamos la conexión y dejamos la BD de test limpia.
  before(async function () {
    await mongoose.connection.asPromise();
    await AdoptionModel.deleteMany({});
    await UserModel.deleteMany({});
    await PetModel.deleteMany({});

    const user = await UserModel.create({
      first_name: 'Test',
      last_name: 'User',
      email: `test_${Date.now()}@example.com`,
      password: 'hashed123'
    });
    const pet = await PetModel.create({ name: 'Firulais', specie: 'dog' });

    userId = user._id.toString();
    petId = pet._id.toString();
  });

  // Al terminar: limpiamos y cerramos la conexión para que mocha finalice.
  after(async function () {
    await AdoptionModel.deleteMany({});
    await UserModel.deleteMany({});
    await PetModel.deleteMany({});
    await mongoose.connection.close();
  });

  describe('GET /api/adoptions', function () {
    it('debe devolver status 200 y un array de adopciones', async function () {
      const { statusCode, body } = await requester.get('/api/adoptions');
      expect(statusCode).to.equal(200);
      expect(body.status).to.equal('success');
      expect(body.payload).to.be.an('array');
    });
  });

  describe('POST /api/adoptions/:uid/:pid', function () {
    it('debe crear una adopción (201) cuando usuario y mascota son válidos', async function () {
      const { statusCode, body } = await requester.post(`/api/adoptions/${userId}/${petId}`);
      expect(statusCode).to.equal(201);
      expect(body.status).to.equal('success');
      expect(body.payload).to.have.property('_id');
      expect(body.payload.owner).to.equal(userId);
      expect(body.payload.pet).to.equal(petId);

      adoptionId = body.payload._id;

      // La mascota debe quedar marcada como adoptada en la BD.
      const petInDb = await PetModel.findById(petId);
      expect(petInDb.adopted).to.equal(true);
    });

    it('debe devolver 400 si la mascota ya estaba adoptada', async function () {
      const { statusCode, body } = await requester.post(`/api/adoptions/${userId}/${petId}`);
      expect(statusCode).to.equal(400);
      expect(body.status).to.equal('error');
    });

    it('debe devolver 404 si el usuario no existe', async function () {
      const fakeUserId = new mongoose.Types.ObjectId().toString();
      const { statusCode, body } = await requester.post(`/api/adoptions/${fakeUserId}/${petId}`);
      expect(statusCode).to.equal(404);
      expect(body.status).to.equal('error');
    });

    it('debe devolver 404 si la mascota no existe', async function () {
      const fakePetId = new mongoose.Types.ObjectId().toString();
      const { statusCode, body } = await requester.post(`/api/adoptions/${userId}/${fakePetId}`);
      expect(statusCode).to.equal(404);
      expect(body.status).to.equal('error');
    });

    it('debe devolver 400 si los ids no tienen formato válido', async function () {
      const { statusCode, body } = await requester.post('/api/adoptions/123/456');
      expect(statusCode).to.equal(400);
      expect(body.status).to.equal('error');
    });
  });

  describe('GET /api/adoptions/:aid', function () {
    it('debe devolver 200 y la adopción cuando el id existe', async function () {
      const { statusCode, body } = await requester.get(`/api/adoptions/${adoptionId}`);
      expect(statusCode).to.equal(200);
      expect(body.status).to.equal('success');
      expect(body.payload._id).to.equal(adoptionId);
    });

    it('debe devolver 404 cuando la adopción no existe', async function () {
      const fakeAdoptionId = new mongoose.Types.ObjectId().toString();
      const { statusCode, body } = await requester.get(`/api/adoptions/${fakeAdoptionId}`);
      expect(statusCode).to.equal(404);
      expect(body.status).to.equal('error');
    });

    it('debe devolver 400 cuando el id no tiene formato válido', async function () {
      const { statusCode, body } = await requester.get('/api/adoptions/no-es-un-id');
      expect(statusCode).to.equal(400);
      expect(body.status).to.equal('error');
    });
  });
});
