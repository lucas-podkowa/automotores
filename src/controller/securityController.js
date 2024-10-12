const express = require('express');
const router = express.Router();
var model = require('./../model/usuario');
//const jwt = require('jsonwebtoken');
//const bcrypt = require('bcrypt');


// -----------------------------------------------------------
// -- Rutas de escucha (endpoint) disponibles para security --
// -----------------------------------------------------------

router.post('/login', login);

// ----------------------------------------------------------- 
// -- funciones utilizadas por el router  -------------------- 
// -----------------------------------------------------------

async function login(req, res) {
    try {
        const { mail, pass } = req.body;
        const [result] = await model.findByMail(mail);

        if (pass === result.pass) {
            let user = {
                nombre: result.nombre,
                apellido: result.apellido,
                mail: result.mail
            }
            //firmar usuario
            res.json(user);
        } else {
            res.status(403).send({
                message: 'Contraseña Incorrecta'
            });
        }
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).send(error.message);
    }
}






// viejo login con callbacks
// function login(req, res) {
//     const { mail, pass } = req.body;
//     //esto no lo quier hacer mas, esto de mandarle (err, result) porque no entiendo un sorongo
//     model.findByMail(mail, (err, result) => {
//         if (err) {
//             res.status(500).send(err);
//         } else {
//             if (pass === result.pass) {
//                 let user = {
//                     nombre: result.nombre,
//                     apellido: result.apellido,
//                     mail: result.mail
//                 }
//                 res.json(user);
//             } else {
//                 res.status(403).send({
//                     message: 'Contraseña Incorrecta'
//                 });
//             }
//         }
//     });
// }


module.exports = router;
//module.exports = { router, verificarToken };





