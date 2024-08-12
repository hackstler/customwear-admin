# Usa una imagen de Node.js como base
FROM node:18 as builder

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de definición de paquetes y sus bloqueos
COPY package*.json ./

# Instala todas las dependencias, incluyendo las devDependencies para construir el proyecto
RUN npm install

# Copia el resto del código fuente del proyecto
COPY . .

# Construye el back-end de TypeScript y el front-end
RUN npm run build
RUN ls -la 
# Comienza una nueva etapa para producir una imagen limpia
FROM node:18

WORKDIR /app

# Copia las dependencias necesarias y los archivos construidos desde la etapa de construcción
COPY --from=builder /app ./

RUN ls -la 

# Expone los puertos para el back-end y el front-end
EXPOSE 9000 7001

# El comando para ejecutar tu aplicación, ajusta según la necesidad de tu proyecto
CMD ["sh", "-c", "medusa migrations run && npm start"] 