# Backend API

Este backend está construido con **Express** y utiliza **SQLite** como base de datos. Provee un servicio básico para registrar los mismos campos que utiliza el proyecto frontend de aspirantes.

## Comandos

```bash
cd backend
npm install    # instalar dependencias
npm start      # inicia el servidor en el puerto 3000
```

La primera vez que se ejecuta `npm start` se crea el archivo `database.sqlite` con las tablas:

- `aspirantes`
- `aspirante_soci`
- `empleados`
- `users`

Cada tabla contiene todos los campos definidos en las interfaces del frontend.
