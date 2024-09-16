const express = require('express');
const config = require('./src/config/config.json');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//conocer los distintos controladores, saber donde estan, traelos como constantes locales
const vehiculoController = require('./src/controller/vehiculo');
//const empleadoController = require('./src/controller/empleado');
const reservaController = require('./src/controller/reserva');

//redireccionar las distintas peticiones a su correspondiente controlador.
app.use("/vehiculo", vehiculoController); //ejemplo de peticion --> https://localhost:8080/vehiculo/listar
// app.use('/empleado', empleadoController);
 app.use('/reserva', reservaController);


// funcion que intenta iniciar el servidor en el puerto especificado o en el siguiente disponible
function startServer(puerto) {
    const server = app.listen(puerto, () => {
        console.log(`Servidor escuchando en: http://localhost:${puerto}`);
    });

    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.log(`Puerto ${puerto} en uso, intentando con el puerto ${puerto + 1}...`);
            puerto++;
            startServer(puerto); // Intenta con el siguiente puerto
        } else {
            console.error("Error al iniciar el servidor:", err);
        }
    });
}

// invocamos la funcion que intenta iniciar el servidor en el puerto que le pasemos
startServer(config.server.port);

module.exports = app;