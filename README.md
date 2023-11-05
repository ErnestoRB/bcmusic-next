# BashCrashers Music App

BCMusicAPP es una aplicacion que a traves de los datos de plataformas musicales, genera recursos únicos, de interes para todos los aficionados a la música.

Actualmente, BCMusicApp es capaz de generar imagenes a partir de los artistas favoritos de sus usuarios en Spotify.
Para ello, se usan scripts de Javascript que permiten la programación de estos banners, generados a través de la API de canvas disponible en el navegador, gracias a [node-canvas](https://github.com/Automattic/node-canvas).
Los scripts son generados por usuarios con permisos especiales, sin embargo, al ser de fuente desconfiable, se necesitan ejecutar en un sandbox. Para ello se usa el modulo [vm](https://nodejs.org/docs/v0.4.8/api/vm.html) ,asi como la librería [vm2](https://nodejs.org/docs/v0.4.8/api/vm.html). Sin embargo, es una característica que se puede considerar _inestable_.

Para manejar el inicio de sesiones, se usa [next-auth](https://next-auth.js.org/), y como ORM se usa [Sequelize](https://sequelize.org/)

## Configurar servicio de mapas

Para poder hacer consultas a la API de [OpenRouteService](https://openrouteservice.org/dev/#/api-docs/v2/) es necesario colocar en el archivo `.env.local` la API KEY, colocando una nueva linea ORS_APIKEY=

La API_KEY se genera [aqui](https://openrouteservice.org/dev/#/login)

## Levantar app (desarrollo)

1. Levantar base de datos MySQL para desarrollo con docker:

```
docker compose up
```

**NOTA** existirá una instancia del cliente phpMyAdmin disponible en http://localhost:8080

2. Generar .env.local

Ejemplo .env.local para desarrollo:

```
NEXTAUTH_SECRET=aquivaloquesea
NEXTAUTH_URL=http://localhost:3000
CLIENT_SECRET=clave_secreta_spotify
CLIENT_ID=clave_id_spotify
GMAIL_PASS=
GMAIL_ADDRESS=
DATABASE_PORT=2020
DATABASE_PASS=b4\$hcr4\$h3rs
RECAPTCHA_SECRET=
NEXT_PUBLIC_RECAPTCHA_CLIENT=
ORS_APIKEY=
```

3. Instalar dependencias (sólo primera vez)

```
npm install
```

4. Levantar app

```
npm run dev
```

---

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
