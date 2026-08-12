const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./db');

// 1. Importamos nuestras rutas
const alumnoRoutes = require('./routes/alumnoRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');

const app = express();
const port = process.env.PORT || 3000;

// 2. PRIMERO LOS MIDDLEWARES (Le enseñamos a Express a leer JSON)
app.use(cors());
app.use(express.json());

// 3. DESPUÉS LAS RUTAS (Ahora sí pueden recibir el req.body sin problema)
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/alumnos', alumnoRoutes);

// Ruta base
app.get('/', (req, res) => {
    res.send('¡El servidor de la Escuela Rodelindo Román está vivo!');
});

// Test de conexión a la base de datos
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('❌ Error conectando a PostgreSQL:', err.stack);
    } else {
        console.log('✅ Conexión exitosa a PostgreSQL en la fecha:', res.rows[0].now);
    }
});

app.listen(port, () => {
    console.log(`🚀 Backend corriendo exitosamente en http://localhost:${port}`);
});