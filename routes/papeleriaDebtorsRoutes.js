const express = require('express');
const router = express.Router();

module.exports = function(db) {
    // Ruta para obtener todos los deudores de papelería
    router.get('/', (req, res) => {
        db.all('SELECT * FROM PapeleriaDebtors', (err, rows) => {
            if (err) {
                console.error('Error al obtener deudores de papelería', err.message);
                res.status(500).json({ error: 'Error al obtener deudores de papelería' });
            } else {
                res.json(rows);
            }
        });
    });

    // Ruta para obtener un deudor de papelería específico por su ID
    router.get('/:id', (req, res) => {
        const debtorId = req.params.id;
        db.get('SELECT * FROM PapeleriaDebtors WHERE id = ?', [debtorId], (err, row) => {
            if (err) {
                console.error('Error al obtener el deudor de papelería', err.message);
                res.status(500).json({ error: 'Error al obtener el deudor de papelería' });
            } else {
                if (row) {
                    res.json(row);
                } else {
                    res.status(404).json({ error: 'Deudor de papelería no encontrado' });
                }
            }
        });
    });

    // Ruta para agregar un nuevo deudor de papelería
    router.post('/', (req, res) => {
        const { name, total_debt } = req.body;
        db.run('INSERT INTO PapeleriaDebtors (name, total_debt) VALUES (?, ?)', 
            [name, total_debt], 
            function (err) {
                if (err) {
                    console.error('Error al agregar un nuevo deudor de papelería', err.message);
                    res.status(500).json({ error: 'Error al agregar un nuevo deudor de papelería' });
                } else {
                    res.json({ id: this.lastID });
                }
            });
    });

    return router;
};
