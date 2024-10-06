const db = require('../config/config_database');


const Persona = {

    create: async (dni, nombre, apellido) => {
        const query = 'INSERT INTO PERSONA (dni, nombre, apellido) VALUES (?, ?, ?)';
        try {
            await db.execute(query, [dni, nombre, apellido]);
        } catch (error) {
            throw new Error('Error al crear la persona: ' + error.message);
        }
    },

    findAll: async () => {
        try {
            const query = 'SELECT * FROM PERSONA';
            const [rows] = await db.execute(query);
            return rows;
        } catch (error) {
            throw new Error('Error al obtener las personas: ' + error.message);
        }
    },

    findByDni: async (dni) => {
        const query = 'SELECT * FROM PERSONA WHERE dni = ?';
        try {
            const [rows] = await db.execute(query, [dni]);
            return rows;
        } catch (error) {
            throw new Error('Error al buscar la persona por DNI: ' + error.message);
        }
    },

    update: async (dni, nombre, apellido) => {
        const query = 'UPDATE PERSONA SET nombre = ?, apellido = ? WHERE dni = ?';
        try {
            await db.execute(query, [nombre, apellido, dni]);
        } catch (error) {
            throw new Error('Error al actualizar la persona: ' + error.message);
        }
    },

    delete: async (dni) => {
        const query = 'DELETE FROM PERSONA WHERE dni = ?';
        try {
            await db.execute(query, [dni]);
        } catch (error) {
            throw new Error('Error al eliminar la persona: ' + error.message);
        }
    }
};

module.exports = Persona;
