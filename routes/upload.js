var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');

var app = express();

var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');

// default options
app.use(fileUpload());


app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    // Validacion de tipo de collecciones permitidas

    var tipoColeccion = ['hospitales', 'medicos', 'usuarios'];

    if (tipoColeccion.indexOf(tipo) < 0) {

        return res.status(400).json({
            ok: false,
            mensaje: 'El tipo de colección no es válido',
            error: { message: 'Las colecciones válidas son: ' + tipoColeccion.join(', ') }
        });
    }


    if (!req.files) {

        return res.status(400).json({
            ok: false,
            mensaje: 'No selecionó nada.',
            error: { message: 'Debe seleccionar una imagen' }
        });
    }

    // Obtener nombre del archivo

    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];


    // Extensiones permitidas

    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];
    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extensión no válida',
            error: { message: 'Las extensiones permitidas son: ' + extensionesValidas.join(', ') }
        });
    }

    // Nombre Personalizado

    var nombreArchivo = `${ id }-${ new Date().getMilliseconds()}.${ extensionArchivo }`;


    // Mover el archivo del temporal al path

    var path = `./uploads/${ tipo }/${ nombreArchivo }`;
    archivo.mv(path, err => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover el archivo',
                error: err
            });
        }

        subirPorTipo(tipo, id, nombreArchivo, res);



    });




});


function subirPorTipo(tipo, id, nombreArchivo, res) {

    switch (tipo) {

        case 'usuarios':
            buscarUsuarioPorId(id, nombreArchivo, res);
            break;

        case 'medicos':
            buscarMedicoPorId(id, nombreArchivo, res);
            break;

        case 'hospitales':
            buscarHospitalPorId(id, nombreArchivo, res);
            break;
    }
}


function buscarUsuarioPorId(id, nombreArchivo, res) {
    Usuario.findById(id, (err, usuario) => {

        if (err) {

            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar el usuario',
                error: err
            });
        }

        if (!usuario) {

            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un usuario con el ID: ' + id,
                error: { message: 'El usuario no existe' }
            });
        }


        var pathActual = './uploads/usuarios/' + usuario.img;

        // Si existe , elimina la imagen anterior

        if (fs.existsSync(pathActual)) {
            fs.unlink(pathActual, (err) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al eliminar imagen actual del usuario',
                        error: err
                    });
                }
            });
        }

        // Actualiza la imagen del usuario

        usuario.img = nombreArchivo;

        usuario.save((err, usuarioActualizado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el usuario',
                    error: err
                });
            }


            return res.status(200).json({
                ok: true,
                mensaje: 'Imagen de usuario actualizada correctamente!',
                usuarioActualizado: usuarioActualizado
            });
        });

    });
}

function buscarMedicoPorId(id, nombreArchivo, res) {
    Medico.findById(id, (err, medico) => {

        if (err) {

            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar el médico',
                error: err
            });
        }

        if (!medico) {

            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un médico con el ID: ' + id,
                error: { message: 'El médico no existe' }
            });
        }

        var pathActual = './uploads/medicos/' + medico.img;

        // Si existe , elimina la imagen anterior

        if (fs.existsSync(pathActual)) {
            fs.unlink(pathActual, (err) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al eliminar imagen actual del médico',
                        error: err
                    });
                }
            });
        }

        // Actualiza la imagen del medico

        medico.img = nombreArchivo;

        medico.save((err, medicoActualizado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el médico',
                    error: err
                });
            }


            return res.status(200).json({
                ok: true,
                mensaje: 'Imagen de médico actualizada correctamente!',
                medicoActualizado: medicoActualizado
            });
        });

    });
}

function buscarHospitalPorId(id, nombreArchivo, res) {
    Hospital.findById(id, (err, hospital) => {

        if (err) {

            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar el hospital',
                error: err
            });
        }

        if (!hospital) {

            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un hospital con el ID: ' + id,
                error: { message: 'El hospital no existe' }
            });
        }


        var pathActual = './uploads/hospitales/' + hospital.img;

        // Si existe , elimina la imagen anterior

        if (fs.existsSync(pathActual)) {
            fs.unlink(pathActual, (err) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al eliminar imagen actual del hospital',
                        error: err
                    });
                }
            });
        }

        // Actualiza la imagen del hospital

        hospital.img = nombreArchivo;

        hospital.save((err, hospitalActualizado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el hospital',
                    error: err
                });
            }


            return res.status(200).json({
                ok: true,
                mensaje: 'Imagen de hospital actualizada correctamente!',
                hospitalActualizado: hospitalActualizado
            });
        });

    });
}


module.exports = app;