const express = require('express');
const router = express.Router();
const model = require('./../model/vehiculo.js');
/*
    index nos delega una peticion HTTP (una URL con sus partes)
    llega desde afuera en un Request (req) y le envio un Response (res)
*/
// ----------------------------------------------------------
// -- rutas de escucha (endpoint) dispoibles para VEHICULOS--
// ----------------------------------------------------------

router.get('/', listar_vehiculo);
router.get('/:vehiculo_id', buscarPorID);
router.post('/', crear_vehiculo);
router.put('/:vehiculo_id', actualizar_vehiculo);
router.delete('/:vehiculo_id', eliminar_vehiculo);

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

async function buscarPorID(req, res) {
    try {
        const vehiculo = await model.buscarPorID(req.params.vehiculo_id);
        if (!vehiculo) {
            return res.status(404).send('El vehiculo no fue encontrado.');
        }
        res.json(vehiculo);
    } catch (error) {
        res.status(500).send(error.message);
    }
}


function crear_vehiculo(req, res) {
    model.crear_vehiculo(req.body, (err, resultado) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(resultado);
        }
    });
}

function actualizar_vehiculo(req, res) {
    let vehiculo_id = req.params.vehiculo_id;
    model.actualizar_vehiculo(req.body, vehiculo_id, (err, resultado) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(resultado);
        }
    });
}

function eliminar_vehiculo(req, res) {
    let vehiculo_id = req.params.vehiculo_id;
    model.eliminar_vehiculo(vehiculo_id, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            if (result.detail.affectedRows == 0) {
                res.status(404).send(result.message);
            } else {
                res.send(result);
            }
        }
    });
}




/*
el problema es la programacion asincrona, tenemos tres formas de encararla
1. utilizando callback   funcion1(funcion2(parametros)){ funcion2(parametros) }  //la descartaremos

2. utilizando Promises   creo una promesa --> espero la resoluncion de dicha promesa

3. utilizando async/await --> async funcion(parametros) { await el resutando de otra funcion }
*/




module.exports = router;
