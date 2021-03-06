// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');


// Inicializar Variables
var app = express();

// Body parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Importar Rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
var hospitalRoutes = require('./routes/hospital');
var medicoRoutes = require('./routes/medico');
var busquedaRoutes = require('./routes/busqueda');
var uploadRoutes = require('./routes/upload');
var imagenesRoutes = require('./routes/imagenes');


// Conexión a la base de datos
// mongoose.connect('mongodb://localhost:2701/hospitalDB', { useNewUrlParser: true }, (err, res) => {

//     if (err) throw err;

//     console.log('Base de Datos: \x1b[32m%s\x1b[0m', 'online');

// });
mongoose.connect('mongodb://localhost:27017/hospitalDB', { useNewUrlParser: true, useCreateIndex: true });


var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection errores:'));
db.once('open', function() {
    // we're connected!
    console.log('Base de Datos: \x1b[32m%s\x1b[0m', 'online');
});

// Rutas
app.use('/medico', medicoRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/upload', uploadRoutes);
app.use('/img', imagenesRoutes);
app.use('/', appRoutes);

// Escuchar peticiones
app.listen(3000, () => {

    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});