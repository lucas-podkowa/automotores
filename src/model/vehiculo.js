const db = require('./bd_connection');
metodos = {}

/*
model/vehiculo.js se encargara de conectarse a la base de datos y devolver informacion al controller.

metodos: es un objeto que sera invocado desde las rutas del controlador. Aquí en el MODEL, dicho objeto posee las funcionalidades que permiten la interaccion con la base de datos como update, create, delete, etc. entonces del lado del controlador puedo invocar por ejemplo a metodos.actualizar_vehiculo();

callback: en una funcion que la enviamos desde las rutas del controlador, es mediante esta funcion que le damos una respuesta desde el MODEL hacia el CONTROLLER, aquí lo que enviamos como error o detalles con mensajes, es lo que recibira controller/vehiculo para seguir su proceso de respuesta hacia el forontend
*/


metodos.listar_vehiculo = function (callback) {
    consulta = "select * from vehiculo";

    db.query(consulta, (err, result) => { //esto puede demorar, es asincrono

        // de la base de datos tengo dos posibles resultados, si pudo traer los datos o si fallo en algo
        // si salio todo bien esos datos quedan en "result", si salio mal esos datos quedan en "err"

        if (err) {
            //si hay un error en la consulta debemos responder con ese error de la base de datos al controlador
            callback(
                {
                    message: 'Error al listar vehículos',
                    detalle: err
                });
        } else {
            // si todo sale bien, el error queda como undefined y como segundo parametro enviamos el resultado
            callback(
                undefined,
                {
                    message: 'Exito al listar vehículos',
                    detalle: result
                });
        }
        //esto lo estoy devolviendo al controlador mediante una funcion que el me dijo que ejecute (callback)
    })
}

metodos.crear_vehiculo = function (datos, callback) {
    const params = [datos.marca_id, datos.matricula, datos.modelo, datos.nombre, datos.kilometraje];
    consulta = "INSERT INTO vehiculo (marca_id, matricula, modelo, nombre, kilometraje) VALUES (?,?,?,?, ?);";
    db.query(consulta, params, (err, result) => {
        if (err) {
            return callback(err, null);

            //----------------------------------------------------------------

            //respuesta = { message: 'Error al crear un nuevo vehículos', detail: err };
            //return callback(respuesta, null);

            //----------------------------------------------------------------

            // if (err.code == "ER_DUP_ENTRY") {
            //     callback({
            //         message: "El Vehiculo ya fue registrado anteriormente",
            //         detail: err
            //     });
            // } else {
            //     callback({
            //         message: "error diferente",
            //         detail: err
            //     });
            // }
        }

        // de hecho, si no hay ningun error, no hace falta un else, el return ya lo hubiera cortado aquí
        respuesta = { message: `${datos.matricula} creado con exito`, detail: result }
        callback(null, respuesta);
    });
}

metodos.actualizar_vehiculo = function (id, datos, callback) {
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

metodos.eliminar_vehiculo = function (vehiculo_id, callback) {
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

metodos.buscarPorID = function (vehiculo_id, callback) {
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


module.exports = metodos;