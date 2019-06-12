var express = require('express');

var app = express();

var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');


// ****************************************************
// Búsqueda específica
// ****************************************************

app.get('/coleccion/:tabla/:busqueda', (req, res) => {

    var tabla = req.params.tabla;
    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');

    var promesa;

    switch (tabla) {

        case 'usuarios':
            promesa = busquedaUsuarios(busqueda, regex);
            break;

        case 'medicos':
            promesa = busquedaMedicos(busqueda, regex);
            break;

        case 'hospitales':
            promesa = busquedaHospitales(busqueda, regex);
            break;

        default:
            res.status(400).json({
                ok: false,
                mensaje: 'Los tipos de búsquedas son: usuarios, médicos y hospitales.',
                error: { message: 'Tipo de tabla/coleccion no Válido' }
            });

    }


    promesa.then(data => {
        res.status(200).json({
            ok: true,
            [tabla]: data
        });
    });


});


// ****************************************************
// Búsqueda General
// ****************************************************


app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');

    Promise.all([
        busquedaHospitales(busqueda, regex),
        busquedaMedicos(busqueda, regex),
        busquedaUsuarios(busqueda, regex)
    ]).then(respuesta => {

        res.status(200).json({
            ok: true,
            hospitales: respuesta[0],
            medicos: respuesta[1],
            usuarios: respuesta[2]
        });

    });


});

function busquedaHospitales(busqueda, regex) {
    // promesa
    return new Promise((resolve, reject) => {

        Hospital.find({ nombre: regex })
            .populate('usuario', ' nombre email')
            .exec((err, hospitales) => {

                if (err) {
                    reject('Error al cargar hospitales', err);
                } else {
                    resolve(hospitales);
                }
            });
    });
}


function busquedaMedicos(busqueda, regex) {
    // promesa
    return new Promise((resolve, reject) => {

        Medico.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .populate('hospital', 'nombre')
            .exec((err, medicos) => {

                if (err) {
                    reject('Error al cargar medicos', err);
                } else {
                    resolve(medicos);
                }
            });
    });
}


function busquedaUsuarios(busqueda, regex) {
    // promesa
    return new Promise((resolve, reject) => {

        Usuario.find({}, 'nombre email role')
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec((err, usuarios) => {

                if (err) {
                    reject('Error al cargar usuarios', err);
                } else {
                    resolve(usuarios);
                }

            });

    });
}



module.exports = app;