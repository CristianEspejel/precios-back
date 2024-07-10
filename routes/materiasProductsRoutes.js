const express = require('express');
const router = express.Router();
const multer = require('multer');
const sqlite3 = require('sqlite3');
const dbPath = './db/full-precios.db'; // Ruta a la base de datos SQLite

// Middleware para validar el cuerpo de la solicitud (puedes implementar la validación según tus necesidades)
const validatePrice = (req, res, next) => {
    // Aquí puedes implementar la validación del precio si es necesario
    next();
};

// Configuración de multer para guardar archivos en la carpeta "public/imgMaterias"
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/imgMaterias'); // Ruta donde se guardarán las imágenes
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname); // Nombre del archivo
    }
});
const upload = multer({ storage: storage });

// Ruta para obtener todos los precios de materias primas
router.get('/', async (req, res) => {
    const db = new sqlite3.Database(dbPath);
    try {
        db.all("SELECT * FROM MateriasPrices", (err, rows) => {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json(rows);
            }
            db.close(); // Cierra la conexión después de enviar la respuesta
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Ruta para agregar un nuevo precio de materias primas
router.post('/add', validatePrice, async (req, res) => {
    const { product_name, description, price } = req.body;
    const db = new sqlite3.Database(dbPath);
    try {
        const stmt = db.prepare("INSERT INTO MateriasPrices (product_name, description, price) VALUES (?, ?, ?)");
        stmt.run(product_name, description, price, function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json({ message: "Precio de materias agregado correctamente", id: this.lastID });
            }
            stmt.finalize(); // Finaliza la declaración
            db.close(); // Cierra la conexión
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Ruta para editar un precio de materias primas existente
router.put('/edit/:id', validatePrice, async (req, res) => {
    const id = req.params.id;
    const updatedFields = req.body;
    const db = new sqlite3.Database(dbPath);
    try {
        let setFields = '';
        let values = [];
        Object.keys(updatedFields).forEach((key, index) => {
            if (key !== 'id') { // Excluimos el campo ID
                setFields += `${key} = ?`;
                values.push(updatedFields[key]);
                if (index < Object.keys(updatedFields).length - 1) {
                    setFields += ', ';
                }
            }
        });
        const stmt = db.prepare(`UPDATE MateriasPrices SET ${setFields} WHERE id = ?`);
        values.push(id); // Agregamos el ID al final de los valores
        stmt.run(...values, function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json({ message: "Precio de materias actualizado correctamente" });
            }
            stmt.finalize(); // Finaliza la declaración
            db.close(); // Cierra la conexión
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Ruta para eliminar un precio de materias primas
router.delete('/delete/:id', async (req, res) => {
    const id = req.params.id;
    const db = new sqlite3.Database(dbPath);
    try {
        const stmt = db.prepare("DELETE FROM MateriasPrices WHERE id = ?");
        stmt.run(id, function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json({ message: "Producto de materias eliminado correctamente" });
            }
            stmt.finalize(); // Finaliza la declaración
            db.close(); // Cierra la conexión
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Ruta para exportar la base de datos a un archivo Excel (pendiente de implementación)
router.get('/export', async (req, res) => {
    // Implementación de la ruta de exportación
});

// Ruta para importar la base de datos desde un archivo Excel (pendiente de implementación)
router.post('/import', async (req, res) => {
    // Implementación de la ruta de importación
});

module.exports = router;
