const express = require('express');
const router = express.Router();

var model = require('./../model/reserva');


// ---------------------------------------------------------- 
// -- rutas de escucha (endpoint) dispoibles para RESERVAS -- 
// ---------------------------------------------------------- 
router.get('/', getAll);
router.post('/', create);
router.put('/:reserva_id', update);
router.put('/cancelar/:reserva_id', cancelar);
router.put('/finalizar/:reserva_id', finalizar);
router.get('/buscar/:reserva_id', buscarPorId);
router.get('/personas', personas_x_reserva);

// ----------------------------------------------------------
// --------- funciones utilizadas por el router ------------- 
// ----------------------------------------------------------

async function getAll(req, res) {
    try {
        const reservas = await model.getAll();
        res.status(200).json(reservas);
    } catch (error) {
        res.status(500).send(error.message);
    }
}


async function create(req, res) {
    try {
        const nueva_reserva = await model.create(req.body);
        res.status(201).json(nueva_reserva);
    } catch (error) {
        res.status(500).send(error.message)
    }
}

function update(req, res) {
    let reserva_id = req.params.reserva_id;//para identificarlo dentro de la base de datos
    let datos_reserva = req.body; //aquellos datos que quiero reemplazar, modificar, etc 
    model.update(reserva_id, datos_reserva, (err, result) => {
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


async function cancelar(req, res) {

    try {
        let reserva_id = req.params.reserva_id;
        const result = await model.cancelarReserva(reserva_id);
        if (result.detail.affectedRows == 0) {
            res.status(404).send(result.message);
        } else {
            res.send(result);
        }
    } catch (error) {
        res.status(500).send(error);
    }
}

async function finalizar(req, res) {
    try {
        let reserva_id = req.params.reserva_id;
        const result = await model.finalizarReserva(reserva_id);
        res.send(result);
    } catch (error) {
        res.status(error.conde || 500).send(error);
    }
}




async function buscarPorId(req, res) {
    try {
        const result = await model.buscarPorId(req.params.reserva_id);
        res.send(result);
    } catch (error) {
        res.status(500).send(err);
    }
}


function personas_x_reserva(req, res) {
    //recibo por parametro dentro de 

    if (req.headers["reservas"]) {
        ids_reservas = req.headers["reservas"]
        try {
            model.personas_x_reserva(ids_reservas, (err, resultado) => {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.json(resultado);
                }
            });
        } catch (error) {
            res.status(500).send({
                message: error.message
            });
        }
    }
}


module.exports = router;

