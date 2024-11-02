const express = require('express');
const router = express.Router();
const model = require('./../model/vehiculo.js');
const securityController = require('./securityController');
/*
    index nos delega una peticion HTTP (una URL con sus partes)
    llega desde afuera en un Request (req) y le envio un Response (res)
*/
// ----------------------------------------------------------
// -- rutas de escucha (endpoint) dispoibles para VEHICULOS--
// ----------------------------------------------------------

router.get('/', securityController.verificarToken, listar_vehiculo);
router.get('/marcas', securityController.verificarToken, getMarcas);
router.get('/:matricula', securityController.verificarToken, buscarPorMatricula);
router.post('/', securityController.verificarToken, crear_vehiculo);
router.put('/:matricula', securityController.verificarToken, actualizar_vehiculo);
router.delete('/:matricula', securityController.verificarToken, eliminar_vehiculo);

// -------------------------------------------------------------- 
// -- funciones utilizadas por el router  ----------------------- 
// --------------------------------------------------------------

async function listar_vehiculo(req, res) {
    try {
        const vehiculos = await model.listar_vehiculo();
        res.json(vehiculos);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

async function buscarPorMatricula(req, res) {
    try {
        const vehiculo = await model.buscarPorMatricula(req.params.matricula);
        if (!vehiculo) {
            return res.status(404).send('El vehiculo no fue encontrado.');
        }
        res.json(vehiculo);
    } catch (error) {
        res.status(500).send(error.message);
    }
}


async function crear_vehiculo(req, res) {
    try {
        const result = await model.crear_vehiculo(req.body);
        res.send(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

async function actualizar_vehiculo(req, res) {
    try {
        let matricula = req.params.matricula;
        const result = await model.actualizar_vehiculo(req.body, matricula);
        //aqui estaba el segundo error, nunca e devolvia nada
        res.status(200).json(result);
    } catch (error) {
        res.status(500).send(error);
    }
}


async function eliminar_vehiculo(req, res) {
    try {
        const { matricula } = req.params;
        const result = await model.eliminar_vehiculo(matricula);
        res.status(200).send(result);
    } catch (error) {
        // si el error viene con us stausCode que le asignamos en el model, la respuesta irá con ese numero
        // sino, el status code por defecto es 500
        const statusCode = error.statusCode || 500;
        res.status(statusCode).send(error.message);
    }
}

async function getMarcas(req, res) {
    try {
        const marcas = await model.getMarcas();
        res.json(marcas);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

module.exports = router;
