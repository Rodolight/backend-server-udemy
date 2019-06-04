// Requires
var express = require('express');
var mongoose = require('mongoose');




// Inicializar Variables
var app = express();


// Rutas
app.get('/', (req, res, next) => {

    res.status(200).json({
        ok: true,
        mensaje: 'Peticion realizada correctamente'
    });

});


// Conexión a la base de datos
// mongoose.connect('mongodb://localhost:2701/hospitalDB', { useNewUrlParser: true }, (err, res) => {

//     if (err) throw err;

//     console.log('Base de Datos: \x1b[32m%s\x1b[0m', 'online');

// });
mongoose.connect('mongodb://localhost:27017/hospitalDB', { useNewUrlParser: true });


var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection errores:'));
db.once('open', function() {
    // we're connected!
    console.log('Base de Datos: \x1b[32m%s\x1b[0m', 'online');
});


// Escuchar peticiones
app.listen(3000, () => {

    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});