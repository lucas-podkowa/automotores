const express = require('express');
const router = express.Router();
const model = require('../model/usuario.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { rulesUser, validate } = require('../middleware/validations.js');

// ----------------------------------------------------------
// -- Rutas de escucha (endpoint) disponibles para USUARIO --
// ----------------------------------------------------------

router.get('/', listar_usuarios);
router.get('/:usuario_id', buscarPorID);
router.post('/', rulesUser(), validate, crear_usuario);
router.put('/:usuario_id', actualizar_usuario);
router.delete('/:usuario_id', eliminar_usuario);
router.post('/login', login);


// -------------------------------------------------------------- 
// -- funciones utilizadas por el router  ----------------------- 
// --------------------------------------------------------------

function listar_usuarios(req, res) {
    model.findAll((err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result);
        }
    });
}

async function listar_usuarios(req, res) {
    try {
        const results = await model.findAll();
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


async function buscarPorID(req, res) {
    const { usuario_id } = req.params;
    try {
        const result = await model.findById(usuario_id);
        if (result.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.status(200).json(result[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function crear_usuario(req, res) {
    const { mail, pass, persona_id } = req.body;
    try {
        const result = await model.create(mail, pass, persona_id);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

    // console.log('paso por aqui y los datos son validos')
}

async function actualizar_usuario(req, res) {
    const { usuario_id } = req.params;
    const { mail, pass, persona_id } = req.body;
    try {
        await model.update(usuario_id, mail, pass, persona_id);
        res.status(200).json({ message: 'Usuario actualizado correctamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function eliminar_usuario(req, res) {
    const { usuario_id } = req.params;
    try {
        await model.delete(usuario_id);
        res.status(200).json({ message: 'Usuario eliminado correctamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function login(req, res) {
    try {
        const { mail, pass } = req.body;
        const [result] = await model.findByMail(mail);
        const iguales = bcrypt.compareSync(pass, result.pass);
        if (iguales) {
            let user = {
                nombre: result.nombre,
                apellido: result.apellido,
                mail: result.mail
            }
            jwt.sign(user, 'ultraMegaSecretPass', { expiresIn: '10000s' }, (err, token) => {
                if (err) {
                    res.status(500).send({ message: err });
                } else {
                    res.status(200).json({ datos: user, token: token });
                }
            })
        } else {
            res.status(403).send({ message: 'Contraseña Incorrecta' });
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}


module.exports = router;


