const pool = require('../db');

const createUsuario = async (req, res) => {
    try {
        const { nombre, email, password, rol } = req.body;
        
        const result = await pool.query(
            'INSERT INTO usuarios (nombre, email, password, rol) VALUES ($1, $2, $3, $4) RETURNING *',
            [nombre, email, password, rol]
        );
        
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creando usuario:', error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = {
    createUsuario
};