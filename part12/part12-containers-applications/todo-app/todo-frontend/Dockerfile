FROM node:20 AS build-stage

WORKDIR /usr/src/app

COPY . .

RUN npm ci 

RUN npm run test

RUN npm run build

# Esta es una nueva etapa, todo lo anterior a esta linea ha desaparecido, excepto por los archivos que queremos COPIAR
FROM nginx:1.25-alpine

# COPIA el directorio dist de build-stage a /usr/share/nginx/html
# El destino fue encontrado en la pagina de Docker hub
COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf
