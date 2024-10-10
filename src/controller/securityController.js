const express = require('express');
const router = express.Router();
var model = require('./../model/usuario');


router.post('/login', login);


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
            res.json(user);
        } else {
            res.status(403).send({
                message: 'Contraseña Incorrecta'
            });
        }
    } catch (error) {
        res.status(500).send(error);
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






