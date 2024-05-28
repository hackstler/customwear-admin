Instalar plugin de letsencrypt
Instalar plugin de redis
Crear app de dokku para postgres
Crear app de dokku para medusa-admin

DESPUES:

Configurar la ssh key para desplegar desde dokku remote

Configurar el github para poder conectar con dokku

Configurar proxy para el 443 ssl

Configurar los puertos de nuestra app (Docu ports en dokku)

Setear dominio

Instalar plugin de letsencrypt

Configurar nginx.conf con la siguiente estructura:

server {
listen 80;
listen 443 ssl;
server_name admin.customwear.es;

ssl_certificate /home/dokku/medusa-admin/tls/server.crt;
ssl_certificate_key /home/dokku/medusa-admin/tls/server.key;
ssl_protocols TLSv1.2 TLSv1.3;
ssl_prefer_server_ciphers off;

access_log /var/log/nginx/medusa-admin-access.log;
error_log /var/log/nginx/medusa-admin-error.log;
underscores_in_headers off;
keepalive_timeout 70;

location / {
gzip on;
gzip_min_length 1100;
gzip_buffers 4 32k;
gzip_types text/css text/javascript text/xml text/plain text/x-component application/javascript application/x-javascript application/json application/xml application/rss+xml font/truetype application/x-font-ttf font/opentype application/vnd.ms-fontobject image/svg+xml;
gzip_vary on;
gzip_comp_level 6;

    proxy_pass http://127.0.0.1:9000;
    http2_push_preload on;
    proxy_http_version 1.1;
    proxy_read_timeout 60s;
    proxy_buffer_size 4k;
    proxy_buffering on;
    proxy_buffers 8 4k;
    proxy_busy_buffers_size 8k;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection $http_connection;
    proxy_set_header Host $http_host;
    proxy_set_header X-Forwarded-For $remote_addr;
    proxy_set_header X-Forwarded-Port $server_port;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Request-Start $msec;

}

client_max_body_size 1m;

error_page 400 401 402 403 405 406 407 408 409 410 411 412 413 414 415 416 417 418 420 422 423 424 426 428 429 431 444 449 450 451 /400-error.html;
location /400-error.html {
root /var/lib/dokku/data/nginx-vhosts/dokku-errors;
internal;
}

error_page 404 /404-error.html;
location /404-error.html {
root /var/lib/dokku/data/nginx-vhosts/dokku-errors;
internal;
}

error_page 500 501 503 504 505 506 507 508 509 510 511 /500-error.html;
location /500-error.html {
root /var/lib/dokku/data/nginx-vhosts/dokku-errors;
internal;
}

error_page 502 /502-error.html;
location /502-error.html {
root /var/lib/dokku/data/nginx-vhosts/dokku-errors;
internal;
}

include /home/dokku/medusa-admin/nginx.conf.d/\*.conf;
}

upstream admin.customwear.es {
server 127.0.0.1:9000;
}

Link de db a medusa-admin

Link de redis a medusa-admin

Setear variables de entorno para redis y db

Hacer pull y git push dokku main para desplegar app

PENDIENTES:

revisar porque siempre se ocupa el 9000

Sacar la db de dokku

sacar el redis de dokku

Crear pipeline de despliegue

REDEPLOY:

sudo docker ps

sudo docker stop container id

dokku ps:restart app-name

O NUEVO CAMBIOS CON:

Hacer pull y git push dokku main para desplegar app
