const db = require('../config/config_database');
metodos = {}

metodos.listar_reservas = function (callback) {
    const consulta = `
    SELECT reserva.*, empleado.nombre AS empleado_nombre, vehiculo.matricula AS vehiculo_matricula 
    FROM reserva 
    JOIN empleado ON reserva.quien_va = empleado.empleado_id
    JOIN vehiculo ON reserva.con_que_va = vehiculo.vehiculo_id
    `;

    db.query(consulta, function (err, result) {

        // de la base de datos tengo dos posibles resultados, si salio todo bien o si salio todo mal
        //      |--> si salio todo bien esos datos quedan en "result"
        //      |--> si salio mal esos datos quedan en "err"

        if (err) {
            callback({ message: 'Error al listar reservas', detalle: err });

        } else {
            callback(undefined, { message: 'Exito al listar reservas', detalle: result });
        }
    })
}
metodos.crear_reserva = function (datos, callback) {
    //let reserva = datos.datos;
    let params = [datos.lugar, datos.evento, datos.empleado_id, datos.vehiculo_id];
    consulta = "INSERT INTO reserva (lugar, evento, quien_va, con_que_va) VALUES (?,?,?,?);";

    db.query(consulta, params, (err, result) => {
        if (err) {
            //si hay un error en la consulta debemos responder con ese error de la base de datos al controlador
            if (err.code == "ER_DUP_ENTRY") {
                callback({ message: "Datos Duplicados", detail: err });
            } else {
                callback({ message: err.message, detail: err });
            }
        } else {
            // si todo sale bien debemos responder el error como nulo y "result" como mensaje de exito
            callback(null, { message: 'Exito al crear reserva', detalle: result });
        }

    });
}

metodos.buscarPorId = function (reserva_id, callback) {
    var consulta = 'SELECT * FROM reserva WHERE reserva_id = ?';
    db.query(consulta, reserva_id, function (err, result) {
        if (err) {
            return callback(err);
        }

        return callback(null, { message: `Reserva encontrada`, detail: result[0] });
    });
}

module.exports = metodos;
// model vehiculo se encargara de conectarse a la base de datos y devolver informacion al controller.