const pool = require('../db');

// Obtener todos los alumnos
const getAlumnos = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM alumnos ORDER BY id ASC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error obteniendo alumnos:', error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Crear un nuevo alumno
const createAlumno = async (req, res) => {
    try {
        const { nombre, fecha_nacimiento, categoria, usuario_id } = req.body;
        
        // El $1, $2, etc., protege contra inyecciones SQL en PostgreSQL
        const result = await pool.query(
            'INSERT INTO alumnos (nombre, fecha_nacimiento, categoria, usuario_id) VALUES ($1, $2, $3, $4) RETURNING *',
            [nombre, fecha_nacimiento, categoria, usuario_id]
        );
        
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creando alumno:', error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = {
    getAlumnos,
    createAlumno
};