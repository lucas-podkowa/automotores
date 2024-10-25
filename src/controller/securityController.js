const express = require('express');
const router = express.Router();
var model = require('./../model/usuario');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


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


        const iguales = bcrypt.compareSync(pass, result.pass);

        if (iguales) {
            let user = {
                nombre: result.nombre,
                apellido: result.apellido,
                mail: result.mail
            }
            //firmar usuario
            jwt.sign(user, 'ultraMegaSecretPass', { expiresIn: '10000s' }, (err, token) => {
                if (err) {
                    res.status(500).send({
                        message: err
                    });
                } else {
                    res.status(200).json(
                        {
                            datos: user,
                            token: token
                        }
                    );
                }
            })
        } else {
            res.status(403).send({
                message: 'Contraseña Incorrecta'
            });
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}


function verificarToken(req, res, next) {
    if (req.headers["authorization"]) {
        try {

            const token = req.headers["authorization"]
            const verified = jwt.verify(token, "ultraMegaSecretPass");
            if (verified) {
                next();
            } else {
                res.status(403).send({
                    message: "Token invalido, permiso denegado"
                });
            }

        } catch (error) {
            res.status(403).send({
                message: "Acceso Denegado"
            });
        }

    } else {
        res.status(403).send({
            message: "No posee token de autorizacion"
        });
    }
}


// C R U D 
 



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


//module.exports = router;
module.exports = { router, verificarToken };





