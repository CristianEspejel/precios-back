const express = require('express');
const router = express.Router();

// Definir rutas para deudores de materias primas
router.get('/', (req, res) => {
    // Lógica para obtener todos los deudores de materias primas
    res.send('Obtener todos los deudores de materias primas');
});

router.post('/', (req, res) => {
    // Lógica para agregar un nuevo deudor de materias primas
    res.send('Agregar un nuevo deudor de materias primas');
});

// Más rutas para actualización, eliminación, etc.

module.exports = router;

