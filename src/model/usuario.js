const db = require('../config/config_database');
//const bcrypt = require('bcrypt');


const Usuario = {
    create: async (mail, pass, persona_id) => {
        //const hashedPass = await bcrypt.hash(pass, 10); // Hasheamos la contraseña
        const query = 'INSERT INTO usuario (mail, pass, persona_id) VALUES (?, ?, ?)';
        try {
            await db.execute(query, [mail, pass, persona_id]);
        } catch (error) {
            throw new Error('Error al crear el usuario: ' + error.message);
        }
    },

    // findAll : function (funCallback) {
    //     var consulta = 'select * from usuario';
    //     db.query(consulta, function (err, rows) {
    //         if (err) {
    //             funCallback(err);
    //             return;
    //         } else {
    //             funCallback(undefined, rows);
    //         }
    //     });
    // },


    findAll: async () => {
        const query = 'SELECT * FROM usuario';
        try {
            const [rows] = await db.execute(query);
            return rows;
        } catch (error) {
            throw new Error('Error al obtener los usuarios: ' + error.message);
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