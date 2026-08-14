# Imagen base ligera con Node.js 20.
FROM node:20-alpine

# Carpeta de trabajo dentro del contenedor.
WORKDIR /app

# Copiamos primero los manifiestos para aprovechar la caché de Docker:
# si package.json no cambia, no reinstala dependencias en cada build.
COPY package*.json ./

# Instalamos solo dependencias de producción.
RUN npm install --omit=dev

# Copiamos el resto del código del proyecto.
COPY . .

# Puerto en el que escucha la app.
EXPOSE 8080

# Comando que arranca el servidor.
CMD ["node", "app.js"]
