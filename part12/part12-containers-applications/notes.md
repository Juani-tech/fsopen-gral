En lugar de modificar un contenedor copiando archivos dentro, podemos crear una nueva imagen que contenga la aplicación "¡Hola, mundo!". La herramienta para esto es el Dockerfile. Dockerfile es un archivo de texto simple que contiene todas las instrucciones para crear una imagen. Vamos a crear un Dockerfile de ejemplo a partir de la aplicación "Hello, World!".

```
FROM node:20

WORKDIR /usr/src/app

COPY ./index.js ./index.js

CMD node index.js
```

La instrucción FROM le dirá a Docker que la base de la imagen debe ser node:20. La instrucción COPY copiará el archivo index.js de la máquina host al archivo con el mismo nombre en la imagen. La instrucción CMD dice lo que sucede cuando se usa docker run. CMD es el comando predeterminado que luego se puede sobrescribir con el argumento dado después del nombre de la imagen. Consulta docker run --help si lo has olvidado.

La instrucción WORKDIR se introdujo para garantizar que no interfiramos con el contenido de la imagen. Garantizará que todos los siguientes comandos tendrán /usr/src/app configurado como el directorio de trabajo. Si el directorio no existe en la imagen base, se creará automáticamente.

Ahora podemos usar el comando docker build para construir una imagen basada en el Dockerfile. Vamos a modificar el comando con una bandera adicional: -t, esto nos ayudará a nombrar la imagen:

```
docker build -t fs-hello-world .
```

Entonces, el resultado es "Docker, por favor construye con la etiqueta (puedes pensar que la etiqueta es el nombre de la imagen resultante.) fs-hello-world el Dockerfile en este directorio". Puedes apuntar a cualquier Dockerfile, pero en nuestro caso, un simple punto significará el Dockerfile en este directorio. Es por eso que el comando termina con un punto. Una vez finalizado el build, puedes ejecutarlo con docker run fs-hello-world.

```
docker run fs-hello-world
```

Como las imágenes son solo archivos, se pueden mover, descargar y eliminar. Puedes enumerar las imágenes que tienes localmente con docker image ls, eliminarlas con docker image rm. Ve qué otro comando tienes disponible con docker image --help.

```
npx express-generator

// install dependencies:
npm install

//run the app:
DEBUG=prueba:* npm start
```

Coloquemos el siguiente Dockerfile en la raíz del proyecto:

```
FROM node:20

WORKDIR /usr/src/app

COPY . .

CMD DEBUG=prueba:* npm start
```

```
docker build -t express-server .
docker run -p 3123:3000 express-server
```

La bandera -p informará a Docker de que se debe abrir un puerto de la máquina host y dirigirlo a un puerto en el contenedor. El formato es -p host-port:application-port.

### .dockerignore

Cuando ejecutamos npm install en nuestra máquina, en algunos casos el administrador de paquetes de node (npm) puede instalar dependencias específicas del sistema operativo durante el paso de instalación. Es posible que accidentalmente movamos partes no funcionales a la imagen con la instrucción COPY. Esto puede suceder fácilmente si copiamos el directorio node_modules en la imagen.

La regla general es copiar solo los archivos que enviarías a GitHub.

Podemos usar .dockerignore para resolver el problema. El archivo .dockerignore es muy similar a .gitignore, puedes usarlo para evitar que se copien archivos no deseados en tu imagen. El archivo debe colocarse junto al Dockerfile. Aquí hay un posible contenido de un .dockerignore

.dockerignore
.gitignore
node_modules
Dockerfile

Nuevo Dockerfile

```
FROM node:20

WORKDIR /usr/src/app

COPY . .

RUN npm install
CMD DEBUG=prueba:* npm start
```

### ci vs install

La instalación de npm puede ser riesgosa. En lugar de usar npm install, npm ofrece una herramienta mucho mejor para instalar dependencias, el comando ci.

Diferencias entre ci e install:

install puede actualizar el package-lock.json
install puede instalar una versión diferente de una dependencia si tiene ^ o ~ en la versión de la dependencia.
ci eliminará la carpeta node_modules antes de instalar cualquier cosa
ci seguirá el package-lock.json y no alterará ningún archivo
En resumen: ci crea compilaciones confiables, mientras que install es el que se usa cuando deseas instalar nuevas dependencias.

Como no estamos instalando nada nuevo durante el paso de compilación y no queremos que las versiones cambien repentinamente, usaremos ci:

```
FROM node:20

WORKDIR /usr/src/app

COPY . .

RUN npm ci
CMD DEBUG=prueba:* npm start
```

Aún mejor, podemos usar npm ci --omit=dev para no perder tiempo instalando dependencias de desarrollo.

To see all the internal logs used in Express, set the DEBUG environment variable to express:\* when launching your app.

### Mejores prácticas de Dockerfile

Hay 2 reglas generales que debes seguir al crear imágenes:

Intenta crear una imagen lo más segura posible
Intenta crear una imagen lo más pequeña posible

---

### 10 buenas practicas de containers con node

https://snyk.io/blog/10-best-practices-to-containerize-nodejs-web-applications-with-docker/

```
FROM node:16.17.0-bullseye-slim
```

This Node.js Docker image tag uses a specific version of the Node.js runtime (`16.17.0`) which maps to the current latest Long Term Support. It uses the `bullseye` image variant which is the current stable Debian 11 version with a far enough end-of-life date. And finally it uses the `slim` image variant to specify a smaller software footprint of the operating system which results in less than 200MB of image size, including the Node.js runtime and tooling.

```
FROM node:alpine
```

These articles cite the use of Node.js Alpine Docker image, but is that really ideal? They do so mostly because it is attributed for the Node.js Alpine Docker image having a smaller software footprint, however, it substantially differs in other traits and that makes it a non-optimal production base image for Node.js application runtimes.

In the case of building a Docker image for production we want to ensure that we only install production dependencies in a deterministic way, and this brings us to the following recommendation for the best practice for installing npm dependencies in a container image:

RUN npm ci --only=production

- Esto settea la env, lo que hace que express optimice ciertas cosas

ENV NODE_ENV production

---

Un gran descuido que debemos resolver es ejecutar la aplicación como root en lugar de usar un usuario con menos privilegios. Hagamos un ultimo arreglo al Dockerfile:

```
FROM node:20

WORKDIR /usr/src/app


COPY --chown=node:node . .

RUN npm ci

ENV DEBUG=playground:*


USER node

CMD npm start
```

docker build -t express-server . && docker run -p 3123:3000 express-server para ejecutarlo. Esto ya parece algo que necesitarías poner en un script para recordarlo. Afortunadamente, Docker nos ofrece una mejor solución.

### Docker-compose

Crea el archivo docker-compose.yml y colócalo en la raíz del proyecto, junto al Dockerfile. Esta vez utilizaremos el mismo puerto para host y contenedor. El contenido del archivo es:

```
services:
  app:                    # The name of the service, can be anything
    image: express-server # Declares which image to use
    build: .              # Declares where to build if image is not found
    ports:                # Declares the ports to publish
      - 3000:3000
```

Ahora podemos usar docker compose up para compilar y ejecutar la aplicación. Si queremos reconstruir las imágenes podemos usar docker compose up --build.

También puedes ejecutar la aplicación en segundo plano con docker compose up -d (-d para separado) y cerrarla con docker compose down.

### Conectando con mongo

Crea un nuevo yaml llamado todo-app/todo-backend/docker-compose.dev.yml que se parece a lo siguiente:

```
services:
  mongo:
    image: mongo
    ports:
      - 3456:27017
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: example
      MONGO_INITDB_DATABASE: the_database
```

El significado de las dos primeras variables de entorno definidas anteriormente se explica en la página de Docker Hub:

Estas variables, usadas en conjunto, crean un nuevo usuario y establecen la contraseña de ese usuario. Este usuario se crea en la base de datos de autenticación del administrador y se le otorga el rol de root ("superusuario").

La última variable de entorno MONGO_INITDB_DATABASE le indicará a MongoDB que cree una base de datos con ese nombre.

```
docker compose -f docker-compose.dev.yml up
```

### Ejecutar en segundo plano y ver logs

A continuación, inicia MongoDB con docker compose -f docker-compose.dev.yml up -d. Con -d se ejecutará en segundo plano. Puedes ver los registros del output con docker compose -f docker-compose.dev.yml logs -f. Allí, -f se asegurará de que seguimos los registros.

### bind mount

Podríamos crear una nueva imagen DESDE mongo y COPIAR el archivo, o podemos usar un bind mount para montar el archivo mongo-init.js en el contenedor. Hagamos esto último.

Bind mount es el acto de vincular un archivo (o directorio) en la máquina host a un archivo (o directorio) en el contenedor. Podríamos agregar una bandera -v con container run. La sintaxis es -v ARCHIVO-EN-HOST:ARCHIVO-EN-CONTENEDOR. Como ya aprendimos sobre Docker Compose, omitámoslo. El bind mount se declara bajo la clave volumes en docker-compose.dev.yml. De lo contrario, el formato es el mismo, primero host y luego contenedor:

```
  mongo:
    image: mongo
    ports:
     - 3456:27017
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: example
      MONGO_INITDB_DATABASE: the_database
    volumes:
      - ./mongo/mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js
```

El resultado del vínculo es que el archivo mongo-init.js en la carpeta mongo de la máquina host es el mismo que el archivo mongo-init.js en el directorio /docker-entrypoint-initdb.d del contenedor. Los cambios en cualquiera de los archivos estarán disponibles en el otro. No necesitamos hacer ningún cambio durante el tiempo de ejecución. Pero esta será la clave para el desarrollo de software en contenedores.

Ejecuta docker compose -f docker-compose.dev.yml down --volumes para asegurarte de que no quede nada y comienza desde cero con docker compose -f docker-compose.dev.yml up para inicializar la base de datos.

El resultado del vínculo es que el archivo mongo-init.js en la carpeta mongo de la máquina host es el mismo que el archivo mongo-init.js en el directorio /docker-entrypoint-initdb.d del contenedor. Los cambios en cualquiera de los archivos estarán disponibles en el otro. No necesitamos hacer ningún cambio durante el tiempo de ejecución. Pero esta será la clave para el desarrollo de software en contenedores.

Ejecuta docker compose -f docker-compose.dev.yml down --volumes para asegurarte de que no quede nada y comienza desde cero con docker compose -f docker-compose.dev.yml up para inicializar la base de datos.

### Permisos en volumenes

En el caso anterior, puedes usar chmod a+r mongo-init.js, que les dará a todos acceso de lectura a ese archivo.

Usa chmod solo en mongo-init.js en tu computadora.

- Si el error de autorizacion persiste:

```
  docker compose -f docker-compose.dev.yml down --volumes
  docker image rm mongo
```

- Si el problema persiste, dejemos de lado la idea de usar un volumen y copiemos el script de inicialización a una imagen personalizada.
- Crea el siguiente Dockerfile al directorio todo-app/todo-backend/mongo

```
FROM mongo

COPY ./mongo-init.js /docker-entrypoint-initdb.d/copy
```

Agrégalo a una imagen con el comando:

```
docker build -t initialized-mongo .copy
```

Ahora cambia al archivo docker-compose.dev.yml para que utilize la nueva imagen:

```
  mongo:
    image: initialized-mongo
    ports:
     - 3456:27017
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: example
      MONGO_INITDB_DATABASE: the_database
```

### Persistencia

Por defecto, los contenedores no conservarán nuestros datos. Cuando cierres el contenedor de la base datos, es posible que no puedas recuperar los datos.

Hay dos métodos distintos para almacenar los datos:

Declarar una ubicación en tu sistema de archivos (llamado bind mount (montaje de enlace))
Dejar que Docker decida dónde almacenar los datos (volumen)

La primera opción es preferible en la mayoría de los casos siempre que uno realmente necesite evitar eliminar los datos.

```
services:
  mongo:
    image: mongo
    ports:
     - 3456:27017
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: example
      MONGO_INITDB_DATABASE: the_database
    volumes:
      - ./mongo/mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js
      - ./mongo_data:/data/db
```

Esto creará un directorio llamado mongo_data en tu sistema de archivos local y lo asignará al contenedor como /data/db. Esto significa que los datos en /data/db se almacenan fuera del contenedor, ¡pero el contenedor aún puede acceder a ellos! Solo recuerda agregar el directorio a .gitignore.

- AGREGAR AL GITIGNORE!!!

Ahora, el volumen es creado y controlado por Docker. Después de iniciar la aplicación (docker compose -f docker-compose.dev.yml up) puedes enumerar los volúmenes con docker volume ls, inspeccionar uno de ellos con docker volume inspect e incluso eliminarlos con docker volume rm:

### MONGO_URL=mongodb://the_username:the_password@localhost:3456/the_database npm run dev

### Poner lo de arriba en .env

### Debuggin (exec)

exec
El comando de Docker exec es un gran bateador. Se puede usar para saltar directamente a un contenedor cuando se está ejecutando.

Nota del editor: al desarrollar, es esencial seguir constantemente los logs del contenedor. Normalmente no ejecuto contenedores en modo detached (es decir, con -d) ya que requiere un poco de esfuerzo adicional abrir los logs.

Cuando estoy 100% seguro de que todo funciona... no, cuando estoy 200% seguro, entonces puedo relajarme un poco e iniciar los contenedores en modo detached. Hasta que todo vuelva a desmoronarse y sea hora de abrir los logs nuevamente.

```
docker exec -it <name> bash
```

Para conservar los cambios, debes usar commit tal como lo hicimos en la sección anterior.

La CLI de mongo requerirá las banderas de nombre de usuario y contraseña para autenticarse correctamente. Las banderas -u root -p example deberían funcionar, los valores corresponden a los que se encuentran en el archivo docker-compose.dev.yml.

### run con redis:

```
REDIS_URL=insert-redis-url-here MONGO_URL=mongodb://the_username:the_password@localhost:3456/the_database npm run dev
```

```
REDIS_URL=redis://localhost:6379 MONGO_URL=mongodb://the_username:the_password@localhost:3456/the_database npm run dev
```

### Persistencia en redis

```
services:
  redis:
    # Everything else
    command: ['redis-server', '--appendonly', 'yes'] # Overwrite the CMD
    volumes: # Declare the volume
      - ./redis_data:/datacopy

```

Los datos ahora se almacenarán en el directorio redis_data de la máquina host. ¡Recuerda agregar el directorio a .gitignore!

## Orquestacion

### React en un container

Serving static files in Express

```
app.use(express.static('public'))
```

### Servir archivos estaticos con serve

Una opción válida para servir archivos estáticos ahora que ya tenemos Node en el contenedor es serve. Intentemos instalar serve y servir los archivos estáticos mientras estamos dentro del contenedor.

```
npm install -g serve
serve dist
```

```
FROM node:20

WORKDIR /usr/src/app

COPY . .

RUN npm ci

RUN npm run build


RUN npm install -g serve


CMD ["serve", "dist"]

```

docker build . -t hello-front y la ejecutamos con docker run -p 5000:3000 hello-front, la aplicación estará disponible en http://localhost:5000.

### Usar multiples etapas

Si bien serve es una opción válida, podemos hacerlo mejor. Un buen objetivo es crear imágenes de Docker para que no contengan nada irrelevante. Con un número mínimo de dependencias, es menos probable que las imágenes se rompan o se vuelvan vulnerables con el tiempo.

Los builds de varias etapas están diseñadas para dividir el proceso de compilación en muchas etapas separadas, donde es posible limitar qué partes de los archivos de imagen se mueven entre las etapas.

Con builds de varias etapas, se puede usar una solución probada y robusta como Nginx para servir archivos estáticos sin muchos dolores de cabeza. La página de Nginx de Docker Hub nos brinda la información necesaria para abrir los puertos y "Alojamiento de contenido estático simple".

Usemos el Dockerfile anterior pero cambiemos FROM para incluir el nombre de la etapa:

- El primer FROM ahora es una etapa llamada build-stage

```
FROM node:20 AS build-stage

WORKDIR /usr/src/app

COPY . .

RUN npm ci

RUN npm run build

# Esta es una nueva etapa, todo lo anterior a esta linea ha desaparecido, excepto por los archivos que queremos COPIAR
FROM nginx:1.25-alpine

# COPIA el directorio dist de build-stage a /usr/share/nginx/html
# El destino fue encontrado en la pagina de Docker hub
COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html

```

Hemos declarado también otra etapa, de donde solo se mueven los archivos relevantes de la primera etapa (el directorio dist, que contiene el contenido estático).

Después de que la construimos de nuevo, la imagen está lista para servir el contenido estático. El puerto predeterminado será 80 para Nginx, por lo que algo como -p 8000:80 funcionará, por lo que los parámetros del comando RUN deben cambiarse un poco.

Los builds de varias etapas también incluyen algunas optimizaciones internas que pueden afectar tus builds. Como ejemplo, los builds de varias etapas se saltan las etapas que no se utilizan. Si deseamos usar una etapa para reemplazar una parte de un pipeline de build, como pruebas o notificaciones, debemos pasar algunos datos a las siguientes etapas. En algunos casos esto está justificado: copia el código de la etapa de prueba a la etapa de build. Esto garantiza que estás haciendo el build con el código probado.

- Con un export va bien para settear VITE_BACKEND_URL fuera del container
