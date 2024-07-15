const express = require('express');
const router = express.Router();

// Middleware para validar el cuerpo de la solicitud
const validatePrice = (req, res, next) => {
    const { product_name, description, price, image_path } = req.body;
    if (!product_name || !description || !price) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }
    next();
};

// Ruta para obtener todos los precios de materias primas con paginación
router.get('/', (req, res) => {
    const db = req.db;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    db.all("SELECT COUNT(*) AS total FROM MateriasPrices", (err, rows) => {
        if (err) {
            console.error('Error al obtener el total de precios de materias primas:', err.message);
            return res.status(500).json({ error: 'Error al obtener el total de precios de materias primas' });
        }

        const totalItems = rows[0].total;
        const totalPages = Math.ceil(totalItems / limit);

        db.all("SELECT * FROM MateriasPrices LIMIT ? OFFSET ?", [limit, offset], (err, rows) => {
            if (err) {
                console.error('Error al obtener los precios de materias primas:', err.message);
                return res.status(500).json({ error: 'Error al obtener los precios de materias primas' });
            }
            res.json({
                totalItems,
                totalPages,
                currentPage: page,
                items: rows
            });
        });
    });
});

// Ruta para agregar un precio de materias primas
router.post('/', validatePrice, (req, res) => {
    const { product_name, description, price, image_path } = req.body;
    const db = req.db;

    db.run("INSERT INTO MateriasPrices (product_name, description, price, image_path) VALUES (?, ?, ?, ?)",
        [product_name, description, price, image_path],
        function (err) {
            if (err) {
                console.error('Error al agregar el precio de materias primas:', err.message);
                return res.status(500).json({ error: 'Error al agregar el precio de materias primas' });
            }
            res.json({ id: this.lastID, product_name, description, price, image_path });
        });
});

// Ruta para editar un precio de materias primas
router.put('/:id', validatePrice, (req, res) => {
    const { product_name, description, price, image_path } = req.body;
    const db = req.db;

    db.run("UPDATE MateriasPrices SET product_name = ?, description = ?, price = ?, image_path = ? WHERE id = ?",
        [product_name, description, price, image_path, req.params.id],
        function (err) {
            if (err) {
                console.error('Error al actualizar el precio de materias primas:', err.message);
                return res.status(500).json({ error: 'Error al actualizar el precio de materias primas' });
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Precio de materias primas no encontrado' });
            }
            res.json({ id: req.params.id, product_name, description, price, image_path });
        });
});

// Ruta para eliminar un precio de materias primas
router.delete('/:id', (req, res) => {
    const db = req.db;

    db.run("DELETE FROM MateriasPrices WHERE id = ?", req.params.id, function (err) {
        if (err) {
            console.error('Error al eliminar el precio de materias primas:', err.message);
            return res.status(500).json({ error: 'Error al eliminar el precio de materias primas' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Precio de materias primas no encontrado' });
        }
        res.json({ message: 'Precio de materias primas eliminado correctamente', changes: this.changes });
    });
});

module.exports = router;
