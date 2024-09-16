const express = require('express');
const router = express.Router();
const empleadoModel = require('./../model/empleado.js'); // Asegúrate de tener el modelo de empleado


// -------------------------------------------------------------- 
// --rutas (endpoint) para manejar las peticiones de empleado --- 
// --------------------------------------------------------------
router.get('/listar', listar);
router.post('/crear', crear);
router.put('/actualizar/:id', actualizar);
router.delete('/eliminar/:id', eliminar);


// -------------------------------------------------------------- 
// -- funciones utilizadas por el router  ----------------------- 
// --------------------------------------------------------------

function listar(req, res) {
    empleadoModel.listar_empleados((err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result);
        }
    });
}

function crear(req, res) {
    const nuevoEmpleado = req.body;
    empleadoModel.crear_empleado(nuevoEmpleado, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(201).json(result);
        }
    });
}

function actualizar(req, res) {
    const empleadoId = req.params.id;
    const datosActualizados = req.body;
    empleadoModel.actualizar_empleado(empleadoId, datosActualizados, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result);
        }
    });
}

function eliminar(req, res) {
    const empleadoId = req.params.id;
    empleadoModel.eliminar_empleado(empleadoId, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result);
        }
    });
}

module.exports = router;
