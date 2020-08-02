const path = require('path'),
 express = require('express'),
 bodyparser = require("body-parser"),
 bcrypt = require('bcrypt'),
 saltRounds = 10,
 app = express(),
 fs = require('fs');

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
const { Console } = require('console');
const io = SocketIO(server);


//* static files
// se llaman asi porque por lo general esos se mandan una sola vez al nav
//   y de cambiar el navegador debe volver a pedir los recursos al servidor 
// path.join() sirve para unir el directorio de acuerdo al OS usado
//   ya que win usa "/" para los directorios, y linux "\".
app.use(express.static(path.join(__dirname, 'public')));

// bodyparser para que el body se parsee en formato json
// extended:true resuelve error de body-parser deprecated
app.use(bodyparser.urlencoded({
    extended:true
}));
app.use(bodyparser.json());

//* websockets
// lo que vamos a usar en ambos extremos cuando se comuniquen el servidor con el navegador
//   es empezar a escuchar eventos.
// El primer evento a escuchar es cuando se conecta un nuevo cliente.
// connection es el nombre del evento en este caso
// TODO: Validate inputs
// TODO: Crear usuario, inicio sesion por ajax
// TODO: Send with enter
// TODO: Shift entenr para enter en input
io.on('connection', (socket) => {
    console.log('new connectionacion', socket.id);

    socket.on('chat:message', data => {
        console.log(data);
        // io es la coneccion entera con todos los clientes. Io.sockets (o sockets) significa a todos los conectados
        // Se le puede dar el mismo nombre de emision porque fue creado en el cliente, no en el srv
        //   pero en el mismo servidor no se pueden crear 2 eventos con el mismo nombre
        //   solo crear uno con el mismo nombre con el que recibis el mismo
        io.emit('chat:message', data);

    }); 

    socket.on('chat:typing', data => {
        console.log(`typing: ${data}`);

        //broadcast se usa para enviar a todos menos al cliente que esta emitiendo el evento
        socket.broadcast.emit('chat:typing', data);
    });
});

app.get('/', (req, res) => {
    res.setHeader('Content-type', 'text/html');
    res.sendFile(path.join(__dirname, './public/chat.html'));
});

// * List Users
app.get('/users', (req, res) => {
    const file = fs.readFileSync('./users.json', 'UTF-8');

    res.setHeader('Content-type', 'text/json');
    res.send(file);
});


// * Create a new User
app.post('/newUser', (req, res) =>{
    res.setHeader('Content-type', 'text/plain');
    console.log(`req body seria: ${req.body}`);
    const name = req.body.newName; 
    const pass = req.body.newPass;
    
    // abrir archvo
    var file = fs.readFileSync('./users.json', 'UTF-8');
    
    // convertirlo a un arreglo
    const json = JSON.parse(file);

    // hash pass
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(pass, salt);

    // insertar un nuevo elemento    
    json.users.push({"name": name, "pass": hash});

    // guardar json en el archivo
    file = fs.writeFileSync('./users.json', JSON.stringify(json));

    res.send('Guardado yay');

});