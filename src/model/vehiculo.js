const db = require('../config/config_database');
reserva = {}


reserva.listar_vehiculo = async function () {

    try {
        consulta = "select * from vehiculo";
        const [vehiculos] = await db.execute(consulta);
        return vehiculos;
    } catch (error) {
        throw new Error('Error al listar el usuario: ' + error.message);
    }
}

reserva.crear_vehiculo = async function (datos, callback) {
    try {
        const params = [datos.marca_id, datos.matricula, datos.modelo, datos.nombre, datos.kilometraje];
        consulta = "INSERT INTO vehiculo (marca_id, matricula, modelo, nombre, kilometraje) VALUES (?,?,?,?, ?);";
        await db.execute(consulta, [params]);
    } catch (error) {
        if (error.code == "ER_DUP_ENTRY") {
            throw new Error('El vehiculo ya fue registrado anteriormente: ' + error.message);
        } else {
            throw new Error('No se pudo realizar la insersion debido a: ' + error.message);
        }
    }
}

reserva.actualizar_vehiculo = function (id, datos, callback) {
    const consulta = 'UPDATE vehiculo SET matricula = ?, marca_id = ?, nombre = ?, modelo = ?, kilometraje = ? WHERE vehiculo_id = ?';
    const params = [datos.matricula, datos.marca_id, datos.nombre, datos.modelo, datos.kilometraje, id];
    db.query(consulta, params, (err, results) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, results);

        //----------------------------------------------------------------
        /*
        if (err) {
            if (err.code == "ER_DUP_ENTRY") { //id duplicado
                return callback({
                    message: "Los datos a insertar generan un vehiculo duplicado",
                    detail: err
                });
            } else { //algun otro codigo de error
                return callback({
                    message: "error diferente, analizar codigo error",
                    detail: err
                });
            }
        } else if (result.affectedRows == 0) { //vehiculo a actualizar no encontrado
            return callback({
                message: "No existe un vehiculo que coincida con el criterio de busqueda",
                detail: result
            });
        } else {
            respuesta = {
                message: `se modificó con exito el vehiculo  ${datos.matricula}`,
                detail: result
            }
            callback(null, respuesta);
        }
        */
    });
}

reserva.eliminar_vehiculo = function (vehiculo_id, callback) {
    const consulta = 'DELETE FROM vehiculo WHERE vehiculo_id = ?';

    db.query(consulta, vehiculo_id, (err, result) => {
        if (err) {
            callback({ message: err.code, detail: err });
        } else {
            if (result.affectedRows == 0) {
                callback(undefined, { message: "no se encontro un vehiculo con el id ingresado", detail: result });
            } else {
                callback(undefined, { message: "Vehiculo eliminado con exito", detail: result });
            }
        }
    });
}

reserva.buscarPorID = function (vehiculo_id, callback) {
    db.query('SELECT * FROM vehiculo WHERE vehiculo_id = ?', vehiculo_id, (err, result) => {
        if (err) {
            callback({ message: "revisar codigo de error", detail: err });
        } else if (result.length == 0) {
            callback(null, { message: `no se encontro un vehiculo con el ID: ${vehiculo_id}`, detail: result });
        } else {
            callback(null, { message: `Vehiculo hallado con exito`, detail: result[0] });
        }
    });
}


module.exports = reserva;