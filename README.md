# BackEnd3 — Primera Entrega (Mocks)

API REST con Express + Mongoose que genera datos falsos (mocking) de usuarios y mascotas,
y permite insertarlos masivamente en MongoDB.

## Requisitos

- Node.js
- MongoDB corriendo localmente en `mongodb://127.0.0.1:27017` (base de datos `mocks`)

## Instalación y ejecución

```bash
npm install
npm run dev     # modo desarrollo (nodemon)
# o
npm start       # modo producción
```

El servidor corre en **http://localhost:8080**.

## Módulo de Mocking

`src/mocks/mocking.module.js` genera:

- **Usuarios** con `password` = `"coder123"` **encriptada con bcrypt**, `role` variable
  (`user` / `admin`) y `pets` como array vacío. Formato de documento Mongo (incluye `_id`).
- **Mascotas** falsas con nombre, especie, fecha de nacimiento e imagen.

## Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/mocks/mockingpets` | Genera mascotas falsas (no las inserta). Acepta `?quantity=N` (default 100). |
| GET | `/api/mocks/mockingusers` | Genera **50 usuarios** con formato Mongo (no los inserta). |
| POST | `/api/mocks/generateData` | Recibe `{ "users": N, "pets": M }` e **inserta** esa cantidad en la BD. |
| GET | `/api/users` | Lista los usuarios insertados (comprobación). |
| GET | `/api/pets` | Lista las mascotas insertadas (comprobación). |

## Ejemplo de uso

```bash
# Generar e insertar 10 usuarios y 10 mascotas
curl -X POST http://localhost:8080/api/mocks/generateData \
  -H "Content-Type: application/json" \
  -d '{ "users": 10, "pets": 10 }'

# Comprobar la inserción
curl http://localhost:8080/api/users
curl http://localhost:8080/api/pets
```
