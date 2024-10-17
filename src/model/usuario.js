const db = require('../config/config_database');
const bcrypt = require('bcrypt');


const Usuario = {
    create: async (mail, pass, persona_id) => {
        const hashedPass = await bcrypt.hash(pass, 10); // Hasheamos la contraseña y reemplazamos pass por hashedPass
        //let textoHashed = bcrypt.hashSync("texto a encriptar",10);
        try {
            const params = [mail, hashedPass, persona_id];
            const consulta = 'INSERT INTO usuario (mail, pass, persona_id) VALUES (?, ?, ?)';
            const result = await db.execute(consulta, params);
            return { message: `Usuario ${mail} creado con exito`, detail: result };
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('Existe un usuario con los mismos datos: ' + error.message);
            } else if (error.code === 'ER_BAD_NULL_ERROR') {
                throw new Error('La columna no puede ser nula: ' + error.message);
            } else if (error.code === 'ER_NO_REFERENCED_ROW') {
                throw new Error(' Falla en la restricción de clave externa.: ' + error.message);
            } else {
                throw new Error('No se pudo registrar al usuario debido a: ' + error.message);
            }
        }
    },

    findAll: async () => {
        const query = 'SELECT * FROM usuario';
        try {
            const [rows] = await db.execute(query);
            return rows;
        } catch (error) {
            throw new Error('Error al obtener los usuarios: ' + error.message);
        }
    },


    //busqueda por mail utilizando callbacks
    findByMail: async (mail) => {

        try {
            const consulta = `SELECT p.nombre, p.apellido, u.mail, u.pass
                                FROM usuario u INNER JOIN persona p ON u.persona_id = p.dni AND u.mail = ?`;
            const [result] = await db.execute(consulta, [mail]);


            if (result.length == 0) {
                throw new Error(`Usuario no encontrado con el mail : ${mail}`);
            }

            return result;
            //si no saltó el error en el if anterior entoces se devuelve el resultado

        } catch (error) {
            throw new Error(error.message);
        }
    },


    findById: async (id) => {
        const query = 'SELECT * FROM usuario WHERE usuario_id = ?';
        try {
            const [rows] = await db.execute(query, [id]);
            return rows;
        } catch (error) {
            throw new Error('Error al buscar el usuario: ' + error.message);
        }
    },

    update: async (id, mail, pass, persona_id) => {
        const hashedPass = await bcrypt.hash(pass, 10);
        const query = 'UPDATE usuario SET mail = ?, pass = ?, persona_id = ? WHERE usuario_id = ?';
        try {
            await db.execute(query, [mail, hashedPass, persona_id, id]);
        } catch (error) {
            throw new Error('Error al actualizar el usuario: ' + error.message);
        }
    },

    delete: async (id) => {
        const query = 'DELETE FROM usuario WHERE usuario_id = ?';
        try {
            await db.execute(query, [id]);
        } catch (error) {
            throw new Error('Error al eliminar el usuario: ' + error.message);
        }
    }
};

module.exports = Usuario;


/*
const sql = 'SELECT * FROM persona WHERE dni = ?';
db.execute(sql, [dni], (err, results) => {
  if (err) throw err;
  console.log(results);
});
*/