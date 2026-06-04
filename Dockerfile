# Etapa 1: Build de Angular
FROM node:20 AS build

WORKDIR /app

# Copiamos dependencias primero (para aprovechar la caché de Docker)
COPY package*.json ./

RUN npm install

# Copiamos todo el código fuente
COPY . .

# Construimos Angular en modo producción
RUN npx ng build --configuration production


# Etapa 2: Servir con Nginx
FROM nginx:stable-alpine

# Limpiamos contenido por defecto de Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copiamos el build generado (nota: Angular 17+ genera en "browser/")
COPY --from=build /app/dist/frontend-contratos/browser /usr/share/nginx/html

# Ajustamos permisos para evitar errores de acceso
RUN chmod -R 755 /usr/share/nginx/html

# Copiamos configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
