const express = require('express');
const router = express.Router();
const alumnoController = require('../controllers/alumnoController');

// Definimos las rutas y las conectamos con su función correspondiente del controlador
router.get('/', alumnoController.getAlumnos);
router.post('/', alumnoController.createAlumno);

module.exports = router;