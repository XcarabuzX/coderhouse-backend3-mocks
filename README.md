# BackEnd3 — Entrega Final (AdoptMe · Dockerizado)

API REST con **Express + Mongoose** para una plataforma de adopción de mascotas.
Permite generar datos falsos (mocking) de usuarios y mascotas, listarlos, y **registrar
adopciones** (un usuario adopta una mascota). Incluye **documentación Swagger**,
**tests funcionales** y está **dockerizada**.

## 🐳 Imagen en Docker Hub

- **Enlace:** https://hub.docker.com/r/gutiruloso/adoptme-backend3
- **Imagen:** `gutiruloso/adoptme-backend3:1.0.0`

```bash
# Descargar la imagen publicada
docker pull gutiruloso/adoptme-backend3:1.0.0
```

## Requisitos

- Node.js 20+ (para ejecución local) **o** Docker.
- MongoDB accesible (local en `mongodb://127.0.0.1:27017` o un contenedor de Mongo).

## Variables de entorno

Copia `.env.example` a `.env` y ajusta:

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `MONGO_URL` | URL de conexión a MongoDB | `mongodb://127.0.0.1:27017/mocks?directConnection=true` |
| `PORT` | Puerto del servidor | `8080` |

## Ejecución local

```bash
npm install
npm run dev     # desarrollo (nodemon)
# o
npm start       # producción
```

El servidor corre en **http://localhost:8080**.

## 🐳 Ejecución con Docker

### Construir la imagen localmente

```bash
docker build -t gutiruloso/adoptme-backend3:1.0.0 .
```

### Ejecutar el contenedor

La app necesita una MongoDB accesible. Le pasamos la URL por variable de entorno.
Si tu MongoDB corre en tu máquina (fuera de Docker), usa `host.docker.internal`:

```bash
docker run -p 8080:8080 \
  -e MONGO_URL="mongodb://host.docker.internal:27017/mocks" \
  gutiruloso/adoptme-backend3:1.0.0
```

### Subir la imagen a Docker Hub

```bash
docker login
docker push gutiruloso/adoptme-backend3:1.0.0
```

## 📚 Documentación Swagger

Con el servidor corriendo, la documentación interactiva del módulo **Users** está en:

```
http://localhost:8080/api/docs
```

## ✅ Tests funcionales

Tests del router de adopciones (`adoption.router.js`) con **Mocha + Chai + Supertest**.
Usan la base de datos `mocks_test` (separada, no toca tus datos).

```bash
npm test
```

## Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/mocks/mockingpets` | Genera mascotas falsas (no las inserta). Acepta `?quantity=N` (default 100). |
| GET | `/api/mocks/mockingusers` | Genera **50 usuarios** con formato Mongo (no los inserta). |
| POST | `/api/mocks/generateData` | Recibe `{ "users": N, "pets": M }` e **inserta** esa cantidad en la BD. |
| GET | `/api/users` | Lista los usuarios insertados. |
| GET | `/api/pets` | Lista las mascotas insertadas. |
| GET | `/api/adoptions` | Lista todas las adopciones. |
| GET | `/api/adoptions/:aid` | Devuelve una adopción por id. |
| POST | `/api/adoptions/:uid/:pid` | El usuario `uid` adopta la mascota `pid`. |

## Ejemplo de uso

```bash
# 1) Generar e insertar 10 usuarios y 10 mascotas
curl -X POST http://localhost:8080/api/mocks/generateData \
  -H "Content-Type: application/json" \
  -d '{ "users": 10, "pets": 10 }'

# 2) Obtener ids
curl http://localhost:8080/api/users
curl http://localhost:8080/api/pets

# 3) Registrar una adopción (reemplaza los ids)
curl -X POST http://localhost:8080/api/adoptions/<userId>/<petId>

# 4) Ver las adopciones
curl http://localhost:8080/api/adoptions
```
