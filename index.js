const path = require('path');
const express = require('express');
const app = express();

//* settings
// process.env.PORT es por si queres desplegar la app en un entorno de la nube
//   donde ya esta el puerto configurado y tendra uno default 
app.set('port', process.env.PORT || 3000);

//* start server
// Una vez configurado el port, se puede usar app.get('port')
const server = app.listen(app.get('port'), () => {
    console.log('server on port', app.get('port'));
});

//* config socket.io
const SocketIO = require('socket.io');
const io = SocketIO(server);


//* static files
// se llaman asi porque por lo general esos se mandan una sola vez al nav
//   y de cambiar el navegador debe volver a pedir los recursos al servidor 
// path.join() sirve para unir el directorio de acuerdo al OS usado
//   ya que win usa "/" para los directorios, y linux "\".
app.use(express.static(path.join(__dirname, 'public')));

//* websockets
// lo que vamos a usar en ambos extremos cuando se comuniquen el servidor con el navegador
//   es empezar a escuchar eventos.
// El primer evento a escuchar es cuando se conecta un nuevo cliente.
// connection es el nombre del evento en este caso
io.on('connection', (socket) => {
    console.log('new connectionacion', socket.id);

    socket.on('chat:message', data => {
        console.log(data);
        // io es la coneccion entera con todos los clientes. Io.sockets (o sockets) significa a todos los conectados
        // Se le puede dar el mismo nombre de emision porque fue creado en el cliente, no en el srv
        //   pero en el mismo servidor no se pueden crear 2 eventos con el mismo nombre
        //   solo crear uno con el mismo nombre con el que recibis el mismo
        sockets.emit('chat:message', data);
    }); 

    socket.on('chat:typing', data => {
        console.log(data);

        //broadcast se usa para enviar a todos menos al cliente que esta emitiendo el evento
        sockets.broadcast('chat:message', data);
    });
});
