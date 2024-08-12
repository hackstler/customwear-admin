# Documentación para Despliegue de MedusaJS en Dokku utilizando Lightsail y Ubuntu 22.04

## Requisitos Previos

- Cuenta en AWS con suscripción a Lightsail.
- Cuenta en GitHub para gestionar repositorios de código.
- Clave SSH para autenticación.

## Paso 1: Configuración Inicial de Lightsail

### Crear una Instancia en Lightsail

1. Inicia sesión en tu cuenta de AWS y ve a la sección de Lightsail.
2. Crea una nueva instancia con Ubuntu 22.04.

### Crear una Clave SSH

1. Genera una nueva clave SSH:
   ```sh
   ssh-keygen -t rsa -b 4096 -C "tu-correo@ejemplo.com"
   ```
2. Sube la clave pública a la instancia de Lightsail.

## Paso 2: Instalar Dokku

1. Conéctate a tu instancia de Lightsail usando SSH.
2. Descarga e instala Dokku:
   ```sh
   wget -NP . https://dokku.com/bootstrap.sh
   sudo DOKKU_TAG=v0.34.7 bash bootstrap.sh
   ```
3. Configura el dominio del servidor:
   ```sh
   dokku domains:set-global dokku.me
   ```

## Paso 3: Configuración de Clave SSH

1. Agrega tu clave pública SSH al usuario Dokku:
   ```sh
   cat ~/.ssh/id_rsa.pub | sudo dokku ssh-keys:add admin
   ```

## Paso 4: Crear Aplicaciones en Dokku

### Crear Aplicación para customwear-admin

1. Crea la aplicación en Dokku:
   ```sh
   dokku apps:create customwear-admin
   ```

### Crear Aplicación para PostgreSQL

1. Instala el plugin de PostgreSQL:
   ```sh
   sudo dokku plugin:install https://github.com/dokku/dokku-postgres.git
   ```
2. Crea una base de datos PostgreSQL:
   ```sh
   dokku postgres:create customwear-db
   ```

### Crear Aplicación para Redis

1. Instala el plugin de Redis:
   ```sh
   sudo dokku plugin:install https://github.com/dokku/dokku-redis.git
   ```
2. Crea una instancia de Redis:
   ```sh
   dokku redis:create customwear-redis
   ```

## Paso 5: Configuración de Variables de Entorno (HINT: Las variables de entorno de db tienen que ir entre " ")

1. Configura las variables de entorno necesarias para `customwear-admin`:
   ```sh
   dokku config:set customwear-admin DATABASE_URL=postgres://usuario:contraseña@localhost:5432/customwear-db
   dokku config:set customwear-admin REDIS_URL=redis://localhost:6379
   ```

## Paso 6: Configurar el Proxy SSL y los Puertos

### Instalar Let's Encrypt y Configurar SSL

1. Instala el plugin Let's Encrypt:
   ```sh
   sudo dokku plugin:install https://github.com/dokku/dokku-letsencrypt.git
   ```
2. Habilita Let's Encrypt para `customwear-admin`:
   ```sh
   dokku letsencrypt customwear-admin
   ```

### Configurar los Puertos de la Aplicación

1. Agrega puertos HTTP y HTTPS:

   ```sh
   dokku proxy:set customwear-admin http:80:5000
   dokku proxy:set customwear-admin https:443:5000
   ```

2. Verifica la configuración de puertos:

   ```sh
   dokku proxy:ports customwear-admin
   ```

3. Reinicia la aplicación:
   ```sh
   dokku ps:restart customwear-admin
   ```

## Paso 7: Desplegar la Aplicación

1. Añade la clave SSH a GitHub para acceder al repositorio de `customwear-admin`.
2. Realiza el push de la aplicación a Dokku:

   ```sh
   git remote add dokku dokku@tu_dominio_o_ip:customwear-admin
   git push dokku main
   ```

3. añadir tu dominio a customwear-admin

4. Añadir link de la DB de postgres a customwear-admin

## Paso 8: Solución de Problemas de SSH

### Registrar Clave Privada con `ssh-agent`

1. Inicia el `ssh-agent`:

   ```sh
   eval "$(ssh-agent -s)"
   ```

2. Añade la clave privada al `ssh-agent`:

   ```sh
   ssh-add -k ~/.ssh/id_rsa
   ```

3. Prueba la conexión SSH:
   ```sh
   ssh -v dokku@localhost
   ```

## Paso 9: Configuración de DNS

1. Añade la IP de la instancia en el panel de control DNS de tu proveedor (como Arsys) para apuntar el dominio a tu servidor Dokku.

## Paso 10: Revisión de Configuración de Nginx

1. Revisa y ajusta la configuración de Nginx si es necesario, ubicada en `/etc/nginx/sites-enabled`.

## Paso 11: Solicitar Certificados para Medusa Admin usando Let's Encrypt

1. Si es necesario, pide certificados adicionales para otras partes de tu aplicación usando Let's Encrypt:
   ```sh
   dokku letsencrypt customwear-admin
   ```

Siguiendo estos pasos, habrás configurado un entorno Dokku en Lightsail con Ubuntu 22.04, desplegado tu aplicación MedusaJS, y asegurado la comunicación mediante SSL.
