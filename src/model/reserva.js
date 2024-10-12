const db = require('../config/config_database');
metodos = {}

metodos.getAll = async function () {
    try {
        const consulta = `SELECT reserva.*,
                            concat(persona.nombre, persona.apellido) AS responsable,
                            concat(veiculo.nombre, '(', vehiculo.matricula, ')') AS vehiculo
                        FROM reserva
                            INNER JOIN persona ON reserva.resposable = persona.dni
                            INNER JOIN vehiculo ON reserva.vehiculo = vehiculo.matricula`;

        const result = await db.execute(consulta);
        return { message: 'Exito al listar reservas', detail: result }

    } catch (error) {
        throw new Error('Error al listar reservas: ' + error.message);
    }
}


metodos.create = async function (datos) {

    try {
        const params = [datos.vehiculo, datos.responsable, datos.desde, datos.hasta];
        const consulta = "INSERT INTO reserva (vehiculo, responsable, desde, hasta) VALUES (?,?,?,?);";
        const result = await db.execute(consulta, params);
        return { message: 'Exito al crear reserva', detalle: result };
    } catch (error) {
        if (error.code === 'ER_BAD_NULL_ERROR') {
            throw new Error('La columna no puede ser nula: ' + error.message);
        } else if (error.code === 'ER_NO_REFERENCED_ROW') {
            throw new Error(' Falla en la restricción de clave externa.: ' + error.message);
        } else {
            throw new Error('No se pudo realizar la reserva debido a: ' + error.message);
        }
    }
}

metodos.update = async function (reserva_id, datos) {

    try {
        // const params = [datos.vehiculo, datos.responsable, datos.desde, datos.hasta];
        // const consulta = "INSERT INTO reserva (vehiculo, responsable, desde, hasta) VALUES (?,?,?,?);";
        // const result = await db.execute(consulta, params);
        // return { message: 'Exito al crear reserva', detalle: result };
    } catch (error) {
        // if (error.code === 'ER_BAD_NULL_ERROR') {
        //     throw new Error('La columna no puede ser nula: ' + error.message);
        // } else if (error.code === 'ER_NO_REFERENCED_ROW') {
        //     throw new Error(' Falla en la restricción de clave externa.: ' + error.message);
        // } else {
        //     throw new Error('No se pudo realizar la reserva debido a: ' + error.message);
        // }
    }
}


module.exports = metodos;
// model vehiculo se encargara de conectarse a la base de datos y devolver informacion al controller.