// model vehiculo se encargara de conectarse a la base de datos y devolver informacion al controller.
const conexion = require('./config_database');

listar_empleados = function (callback) {
    consulta = "select * from empleados";

    conexion.query(consulta, function (err, result) {

        //de la base de datos tengo dos posibles resultados
        // si salio todo bien o si salio todo mal
        //si salio todo bien esos datos quedan en "result"
        // si salio mal esos datos quedan en "err"

        if (err) {
            //si hay un error en la consulta debemos responder con ese error de la base de datos al controlador
            callback({
                message: 'Error al listar empleados',
                detalle: err
            });

        } else {
            // si todo sale bien debemos responder con un mensaje de exito
            callback(
                undefined,
                {
                    message: 'Exito al listar empleados',
                    detalle: result
                });
        }

        //esto lo estoy devolviendo al controlador mediante una funcion que el me dijo que ejecute (callback)

    })
}

crear_empleado = function (datos, callback) {
    consulta = "INSERT INTO empleados (nombre, apellido) VALUES (?,?);";

    conexion.query(consulta, function (err, result) {
        if (err) {
            //si hay un error en la consulta debemos responder con ese error de la base de datos al controlador
            callback({
                message: 'Error al listar empleados',
                detalle: err
            });

        } else {
            // si todo sale bien debemos responder con un mensaje de exito
            callback(
                undefined,
                {
                    message: 'Exito al listar empleados',
                    detalle: result
                });
        }

    })
}