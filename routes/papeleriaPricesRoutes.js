const express = require('express');
const router = express.Router();
const multer = require('multer');
const sqlite3 = require('sqlite3');

// Middleware para validar el cuerpo de la solicitud
const validatePrice = (req, res, next) => {
    next();
};

// Configuración de multer para guardar archivos en la carpeta "public/imgPape"
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/imgPape');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Ruta para obtener todos los precios de papelería
router.get('/', (req, res) => {
    const db = req.db;
    db.all("SELECT * FROM PapeleriaPrices", (err, rows) => {
        if (err) {
            res.status(500).json({ error: 'Error al obtener los precios de papelería: ' + err.message });
        } else {
            res.json(rows);
        }
        db.close();
    });
});

// Ruta para agregar un nuevo precio de papelería
router.post('/add', validatePrice, (req, res) => {
    const { product_name, description, price, image_path } = req.body;
    const db = req.db;
    const stmt = db.prepare("INSERT INTO PapeleriaPrices (product_name, description, price, image_path) VALUES (?, ?, ?, ?)");
    stmt.run(product_name, description, price, image_path, function (err) {
        if (err) {
            res.status(500).json({ error: 'Error al agregar el precio de papelería: ' + err.message });
        } else {
            res.json({ message: "Precio de papelería agregado correctamente", id: this.lastID });
        }
        stmt.finalize();
        db.close();
    });
});

// Ruta para editar un precio de papelería existente
// router.put('/edit/:id', validatePrice, (req, res) => {
//     const id = req.params.id;
//     const updatedFields = req.body;
//     const db = req.db;
//     let setFields = '';
//     let values = [];
//     Object.keys(updatedFields).forEach((key, index) => {
//         if (key !== 'id') {
//             setFields += `${key} = ?`;
//             values.push(updatedFields[key]);
//             if (index < Object.keys(updatedFields).length - 1) {
//                 setFields += ', ';
//             }
//         }
//     });
//     const stmt = db.prepare(`UPDATE PapeleriaPrices SET ${setFields} WHERE id = ?`);
//     values.push(id);
//     stmt.run(...values, function (err) {
//         if (err) {
//             res.status(500).json({ error: 'Error al actualizar el precio de papelería: ' + err.message });
//         } else {
//             res.json({ message: "Precio de papelería actualizado correctamente" });
//         }
//         stmt.finalize();
//         db.close();
//     });
// });

// Ruta para eliminar un precio de papelería
// Ruta para editar un precio de papelería existente
router.put('/edit/:id', validatePrice, (req, res) => {
    const id = req.params.id;
    const updatedFields = req.body;
    const db = req.db;
    let setFields = '';
    let values = [];
    Object.keys(updatedFields).forEach((key, index, array) => {
        if (key !== 'id') {
            setFields += `${key} = ?`;
            values.push(updatedFields[key]);
            if (index < array.length - 1) {
                setFields += ', ';
            }
        }
    });
    const stmt = db.prepare(`UPDATE PapeleriaPrices SET ${setFields} WHERE id = ?`);
    values.push(id);
    stmt.run(values, function (err) {
        if (err) {
            res.status(500).json({ error: 'Error al actualizar el precio de papelería: ' + err.message });
        } else {
            res.json({ message: "Precio de papelería actualizado correctamente" });
        }
        stmt.finalize();
        db.close();
    });
});




router.delete('/delete/:id', (req, res) => {
    const id = req.params.id;
    const db = req.db;
    const stmt = db.prepare("DELETE FROM PapeleriaPrices WHERE id = ?");
    stmt.run(id, function (err) {
        if (err) {
            res.status(500).json({ error: 'Error al eliminar el precio de papelería: ' + err.message });
        } else {
            res.json({ message: "Producto de papelería eliminado correctamente" });
        }
        stmt.finalize();
        db.close();
    });
});

module.exports = router;
