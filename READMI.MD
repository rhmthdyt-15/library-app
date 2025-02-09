# Panduan Instalasi Backend

## Prasyarat

- Git
- Docker
- Docker Compose

## Langkah-langkah Instalasi

1. Clone repository

```bash
git clone https://github.com/acaboy/muhamad-pasa-library-app.git
```

2. Masuk ke direktori backend

```bash
cd backend
```

3. Install dependensi PHP menggunakan Docker

Untuk Windows:

```bash
docker run --rm -v ${PWD}:/app composer install
```

4. Buat file .env dengan isi sebagai berikut:

```env
APP_NAME=Laravel
APP_ENV=local
APP_KEY=base64:jlDhe3pt+hVlPi21xEGFW/TvjRbD9JLB3+0rqtEESSk=
APP_DEBUG=true
APP_URL=http://localhost

LOG_CHANNEL=stack
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=debug

DB_CONNECTION=mysql
DB_HOST=library_mysql
DB_PORT=3306
DB_DATABASE=library_db
DB_USERNAME=user
DB_PASSWORD=123456

BROADCAST_DRIVER=log
CACHE_DRIVER=file
FILESYSTEM_DISK=local
QUEUE_CONNECTION=sync
SESSION_DRIVER=file
SESSION_LIFETIME=120

MEMCACHED_HOST=127.0.0.1

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_MAILER=smtp
MAIL_HOST=mailpit
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="hello@example.com"
MAIL_FROM_NAME="${APP_NAME}"

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=
AWS_USE_PATH_STYLE_ENDPOINT=false

PUSHER_APP_ID=
PUSHER_APP_KEY=
PUSHER_APP_SECRET=
PUSHER_HOST=
PUSHER_PORT=443
PUSHER_SCHEME=https
PUSHER_APP_CLUSTER=mt1

VITE_PUSHER_APP_KEY="${PUSHER_APP_KEY}"
VITE_PUSHER_HOST="${PUSHER_HOST}"
VITE_PUSHER_PORT="${PUSHER_PORT}"
VITE_PUSHER_SCHEME="${PUSHER_SCHEME}"
VITE_PUSHER_APP_CLUSTER="${PUSHER_APP_CLUSTER}"

OCTANE_SERVER=swoole
```

6. Build dan jalankan Docker container

```bash
docker-compose up -d --build
```

7. Jalankan database migrations

```bash
docker exec -it library_app php artisan migrate:fresh
```

8. Jalankan seeder

```bash
docker exec -it library_app php artisan db:seed --class=UserSeeder
```

9. Reload Laravel Octane

```bash
docker exec -it library_app php artisan octane:reload
```

## Informasi Tambahan

- Aplikasi berjalan dalam container Docker untuk memastikan konsistensi lingkungan pengembangan
- Laravel Octane digunakan untuk meningkatkan performa aplikasi
- Perintah migrate:fresh akan mereset dan membuat ulang seluruh tabel database

## Troubleshooting

Jika mengalami masalah:

1. Pastikan semua container Docker berjalan:

```bash
docker ps
```

2. Periksa log container Docker:

```bash
docker logs library_app
```

## Catatan

- Flag --build pada docker-compose up memastikan image Docker dibangun ulang
- Flag -d menjalankan container dalam mode detached (background)
- Gunakan docker-compose down untuk menghentikan dan menghapus semua container
