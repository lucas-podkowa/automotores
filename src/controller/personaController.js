const model = require('../model/persona');
const express = require('express');
const router = express.Router();

// ----------------------------------------------------------
// -- Rutas de escucha (endpoint) disponibles para PERSONA --
// ----------------------------------------------------------

router.get('/', listar_personas);
router.get('/:dni', buscarPorDni);
router.post('/', crear_persona);
router.put('/:dni', actualizar_persona);
router.delete('/:dni', eliminar_persona);

// Funciones CRUD

async function listar_personas(req, res) {
    try {
        const results = await model.findAll();
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


async function buscarPorDni(req, res) {
    const { dni } = req.params;
    try {
        const results = await model.findByDni(dni);
        if (results.length === 0) {
            return res.status(404).json({ message: 'Persona no encontrada' });
        }
        res.status(200).json(results[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


async function crear_persona(req, res) {
    const { dni, nombre, apellido } = req.body;
    try {
        await model.create(dni, nombre, apellido);
        res.status(201).json({ message: 'Persona creada correctamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function actualizar_persona(req, res) {
    const { dni } = req.params;
    const { nombre, apellido } = req.body;
    try {
        await model.update(dni, nombre, apellido);
        res.status(200).json({ message: 'Persona actualizada correctamente' });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).send(error.message);
    }
}

async function eliminar_persona(req, res) {
    const { dni } = req.params;
    try {
        const result = await model.delete(dni);

        res.status(200).json({ message: 'Persona eliminada correctamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


module.exports = router;
