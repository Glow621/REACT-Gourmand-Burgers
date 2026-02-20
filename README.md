# Gourmand Burgers

Landing + menu interactivo para una hamburgueseria. Incluye carrito, favoritos, cupones, delivery/pickup y mapa de sucursales.

## Funcionalidades
- Menu con busqueda, filtros por categoria y ordenamientos.
- Favoritos persistentes en localStorage.
- Carrito con extras, cantidades, propina, cupones y resumen de total.
- Modal de producto con extras y cantidad.
- Carousel de destacados.
- Mapa de sucursales con Leaflet y geolocalizacion.
- Tema claro/oscuro persistente.
- UI responsive para mobile.

## Stack
- React + Vite
- Leaflet
- Firebase Hosting (output en `dist`)

## Scripts
```bash
npm install
npm run dev
npm run build
npm run preview
```

## Deploy en Firebase
1. `npm run build`
2. `firebase deploy`

## Estructura
- `src/App.jsx`: orquesta estados y conecta componentes.
- `src/components/`: UI por seccion (Header, Menu, Cart, Stores, etc).
- `src/data/catalog.js`: productos, extras, cupones y sucursales.
- `src/utils/helpers.js`: helpers de formato y utilidades.
- `public/styles.css`: estilos globales.

## Notas
- La seccion de sucursales y el mapa se cargan con lazy loading para reducir el bundle inicial.
- Los datos son demo y pueden editarse en `src/data/catalog.js`.

**Última actualización**: Febrero 2026

