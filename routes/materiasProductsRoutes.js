// const express = require('express');
// const router = express.Router();
// const multer = require('multer');
// const sqlite3 = require('sqlite3');
// // const dbPath = './db/full-precios.db'; // Ruta a la base de datos SQLite

// const validatePrice = (req, res, next) => {
//     const { product_name, description, price, image_path } = req.body;
//     if (!product_name || !description || !price) {
//         return res.status(400).json({ error: 'Todos los campos son obligatorios' });
//     }
//     next();
// };

// // Configuración de multer para guardar archivos en la carpeta "public/imgMaterias"
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, 'public/imgMaterias'); // Ruta donde se guardarán las imágenes
//     },
//     filename: function (req, file, cb) {
//       cb(null, Date.now() + '-' + file.originalname); // Nombre del archivo
//     }
// });
// const upload = multer({ storage: storage });

// // Ruta para obtener todos los precios de materias primas
// router.get('/', (req, res) => {
//     const db = req.db;
//     db.all("SELECT * FROM MateriasPrices", (err, rows) => {
//         if (err) {
//             console.error('Error al obtener los precios de papelería:', err.message);
//             return res.status(500).json({ error: 'Error al obtener los precios de papelería' });
//         }
//         res.json(rows);
//         db.close();
//     });
// });

// // Ruta para agregar un nuevo precio de materias primas
// router.post('/add', validatePrice, (req, res) => {
//     const { product_name, description, price, image_path } = req.body;
//     const db = req.db;
//     const stmt = db.prepare("INSERT INTO MateriasPrices (product_name, description, price, image_path) VALUES (?, ?, ?, ?)");
//     stmt.run(product_name, description, price, image_path, function (err) {
//         if (err) {
//             console.error('Error al agregar el precio de materias:', err.message);
//             return res.status(500).json({ error: 'Error al agregar el producto de materias' });
//         }
//         res.json({ message: "Precio de papelería agregado correctamente", id: this.lastID });
//         stmt.finalize();
//         db.close();
//     });
// });

// // Ruta para editar un precio de materias primas existente
// router.put('/edit/:id', validatePrice, (req, res) => {
//     const id = req.params.id;
//     const updatedFields = req.body;
//     const db = req.db;

//     let setFields = '';
//     let values = [];
//     Object.keys(updatedFields).forEach((key, index, array) => {
//         if (key !== 'id') {
//             setFields += `${key} = ?`;
//             values.push(updatedFields[key]);
//             if (index < array.length - 1) {
//                 setFields += ', ';
//             }
//         }
//     });

//     if (!setFields) {
//         return res.status(400).json({ error: 'No hay campos para actualizar' });
//     }

//     const stmt = db.prepare(`UPDATE MateriasPrices SET ${setFields} WHERE id = ?`);
//     values.push(id);
//     stmt.run(values, function (err) {
//         if (err) {
//             console.error('Error al actualizar el precio de materias:', err.message);
//             return res.status(500).json({ error: 'Error al actualizar el precio de materias' });
//         }
//         res.json({ message: "Precio de materias actualizado correctamente" });
//         stmt.finalize();
//         db.close();
//     });
// });

// // Ruta para eliminar un precio de materias primas
// router.delete('/delete/:id', (req, res) => {
//     const id = req.params.id;
//     const db = req.db;
//     const stmt = db.prepare("DELETE FROM MateriasPrices WHERE id = ?");
//     stmt.run(id, function (err) {
//         if (err) {
//             console.error('Error al eliminar el precio de papelería:', err.message);
//             return res.status(500).json({ error: 'Error al eliminar el precio de papelería' });
//         }
//         res.json({ message: "Producto de papelería eliminado correctamente" });
//         stmt.finalize();
//         db.close();
//     });
// });

// // Ruta para exportar la base de datos a un archivo Excel (pendiente de implementación)
// router.get('/export', async (req, res) => {
//     // Implementación de la ruta de exportación
// });

// // Ruta para importar la base de datos desde un archivo Excel (pendiente de implementación)
// router.post('/import', async (req, res) => {
//     // Implementación de la ruta de importación
// });

// module.exports = router;
const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3');

// Middleware para validar el cuerpo de la solicitud
const validatePrice = (req, res, next) => {
    const { product_name, description, price, image_path } = req.body;
    if (!product_name || !description || !price) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }
    next();
};

// Ruta para obtener todos los precios de materias primas
router.get('/', (req, res) => {
    const db = req.db;
    db.all("SELECT * FROM MateriasPrices", (err, rows) => {
        if (err) {
            console.error('Error al obtener los precios de materias primas:', err.message);
            return res.status(500).json({ error: 'Error al obtener los precios de materias primas' });
        }
        res.json(rows);
    });
});

// Ruta para agregar un nuevo precio de materias primas
router.post('/add', validatePrice, (req, res) => {
    const { product_name, description, price, image_path } = req.body;
    const db = req.db;
    const stmt = db.prepare("INSERT INTO MateriasPrices (product_name, description, price, image_path) VALUES (?, ?, ?, ?)");
    stmt.run(product_name, description, price, image_path, function (err) {
        if (err) {
            console.error('Error al agregar el precio de materias primas:', err.message);
            return res.status(500).json({ error: 'Error al agregar el precio de materias primas' });
        }
        res.json({ message: "Precio de materias primas agregado correctamente", id: this.lastID });
    });
});

// Ruta para editar un precio de materias primas existente
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

    if (!setFields) {
        return res.status(400).json({ error: 'No hay campos para actualizar' });
    }

    const stmt = db.prepare(`UPDATE MateriasPrices SET ${setFields} WHERE id = ?`);
    values.push(id);
    stmt.run(values, function (err) {
        if (err) {
            console.error('Error al actualizar el precio de materias primas:', err.message);
            return res.status(500).json({ error: 'Error al actualizar el precio de materias primas' });
        }
        res.json({ message: "Precio de materias primas actualizado correctamente" });
    });
});

// Ruta para eliminar un precio de materias primas
router.delete('/delete/:id', (req, res) => {
    const id = req.params.id;
    const db = req.db;
    const stmt = db.prepare("DELETE FROM MateriasPrices WHERE id = ?");
    stmt.run(id, function (err) {
        if (err) {
            console.error('Error al eliminar el precio de materias primas:', err.message);
            return res.status(500).json({ error: 'Error al eliminar el precio de materias primas' });
        }
        res.json({ message: "Precio de materias primas eliminado correctamente" });
    });
});

module.exports = router;
