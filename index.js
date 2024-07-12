require('dotenv').config();

const express = require('express');
const sqlite3 = require('sqlite3');
const papeleriaPricesRoutes = require('./routes/papeleriaPricesRoutes');
const materiasProductsRoutes = require('./routes/materiasProductsRoutes');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const dbPath = process.env.DB_PATH || './db/full-precios.db';

// Middleware CORS
const allowedOrigins = ['http://localhost:5173', 'https://jolly-hummingbird-cb9b1e.netlify.app'];
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('No permitido por CORS'));
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
}));

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para procesar datos JSON
app.use(express.json());

// Middleware para manejar la conexión a la base de datos
const dbMiddleware = (req, res, next) => {
    req.db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Error al abrir la base de datos: ' + err.message });
        }
        next();
    });
};

app.use(dbMiddleware);

// Rutas para los precios de papelería
app.use('/prices/papeleria', papeleriaPricesRoutes);
app.use('/products/materias', materiasProductsRoutes);

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor iniciado en el puerto ${PORT}`);
});
