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

reserva.crear_vehiculo = async function (datos) {
    try {
        const params = [datos.marca_id, datos.matricula, datos.modelo, datos.nombre, datos.kilometraje];
        const consulta = "INSERT INTO vehiculo (marca_id, matricula, modelo, nombre, kilometraje) VALUES (?,?,?,?,?);";
        const result = await db.execute(consulta, params);
        return { message: `${datos.nombre} ${datos.modelo} creado con exito`, detail: result };
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            throw new Error('El vehiculo ya fue registrado anteriormente: ' + error.message);
        } else if (error.code === 'ER_BAD_NULL_ERROR') {
            throw new Error('La columna no puede ser nula: ' + error.message);
        } else if (error.code === 'ER_NO_REFERENCED_ROW') {
            throw new Error(' Falla en la restricción de clave externa.: ' + error.message);
        } else {
            throw new Error('No se pudo realizar la insersion debido a: ' + error.message);
        }
    }
}

reserva.actualizar_vehiculo = async function (id, datos) {

    try {
        const consulta = 'UPDATE vehiculo SET matricula = ?, marca_id = ?, nombre = ?, modelo = ?, kilometraje = ? WHERE matricula = ?';
        const params = [datos.matricula, datos.marca_id, datos.nombre, datos.modelo, datos.kilometraje, id];
        const result = await db.execute(consulta, [params]);

        if (result.affectedRows == 0) { //vehiculo a actualizar no encontrado
            throw new Error("No existe un vehiculo que coincida con el criterio de busqueda");
        } else {
            return {
                message: `se modificó con exito el vehiculo  ${datos.matricula}`,
                detail: result
            }
        }
    } catch (error) {
        if (error.code == "ER_DUP_ENTRY") {
            throw new Error("Los datos a insertar generan un vehiculo duplicado");
        } else { //algun otro codigo de error
            throw new Error(`Error diferente, analizar código de error: ${error.code}`);
        }
    }
}

reserva.eliminar_vehiculo = async function (matricula) {
    try {
        const consulta = 'DELETE FROM vehiculo WHERE matricula = ?';
        const result = await db.execute(consulta, [matricula]);

        if (result.affectedRows === 0) {
            const error = new Error(`No se encontró un vehículo con la matrícula ingresada: ${matricula}`);
            error.statusCode = 404;
            throw error;
        }

        // aca da lo mismo si colocamos en un eslse o no
        return { message: "Vehículo eliminado con éxito", detail: result };

    } catch (error) {
        throw new Error('Error al eliminar el vehiculo: ' + error.message);
    }
}

reserva.buscarPorMatricula = async function (matricula) {
    try {
        const [result] = await db.execute('SELECT * FROM vehiculo WHERE matricula = ?', [matricula]);
        if (result.length == 0) {
            throw new Error(`No se encontro un vehiculo con la Matricula: ${matricula}`);
        } else {
            return { message: `Vehiculo hallado con exito`, detail: result[0] };
        }
    } catch (error) {
        throw new Error('Revisar codigo de error: ' + error.message);
    }
}



module.exports = reserva;