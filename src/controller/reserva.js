const express = require('express');
const app = express();
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

var model = require('./../model/reserva');


// ---------------------------------------------------------- 
// -- rutas de escucha (endpoint) dispoibles para RESERVAS -- 
// ---------------------------------------------------------- 
app.get('/', listar);
app.post('/', crear);
app.put('/:reserva_id', actualizar);
app.put('/cancelar/:reserva_id', cancelar);
app.put('/finalizar/:reserva_id', finalizar);
app.get('/buscar/:reserva_id', buscarPorId);
app.get('/personas', personas_x_reserva);

// ----------------------------------------------------------
// --------- funciones utilizadas por el router ------------- 
// ----------------------------------------------------------

function listar(req, res) {
    model.listar((err, resultado) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(resultado);
        }
    });
}


function crear(req, res) {
    model.crearReserva(req.body, (err, resultado) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(resultado);
        }
    });
}

function cancelar(req, res) {
    let reserva_id = req.params.reserva_id;

    model.cancelarReserva(reserva_id, (err, result) => {
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

function finalizar(req, res) {
    let reserva_id = req.params.reserva_id;
    model.finalizarReserva(reserva_id, (err, result) => {
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

function actualizar(req, res) {
    let reserva_id = req.params.reserva_id;//para identificarlo dentro de la base de datos
    let datos_reserva = req.body; //aquellos datos que quiero reemplazar, modificar, etc 
    model.actualizarReserva(reserva_id, datos_reserva, (err, result) => {
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


function buscarPorId(req, res) {
    model.buscarPorId(req.params.reserva_id, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(result);
        }
    });
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


module.exports = app;

