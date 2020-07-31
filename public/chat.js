// io es una variable accesible cuando se lo requirio en index.html
const socket = io();

// DOM elements
let message = document.getElementById("message");
let username = document.getElementById("username");
let btn = document.getElementById("send");
let output = document.getElementById("output");
let actions = document.getElementById("actions");

btn.addEventListener('click', function () {
    let data = {
        username: username.value,
        message: message.value
    };

    socket.emit('chat:message', data);
});

message.addEventListener('keypress', () => {
    socket.emit('chat:typing', username.value);
});


// Esta data que llega fue definida en el eventListener del btn, mas arriba
//   enviada al srv por un clinete, y devuelta a este evento desde el srv
//   para todos los clientes
socket.on('chat:message', data => {
    actions.innerHTML = '';
    output.innerHTML += `
    <p>
        <strong>${data.username}</strong>: ${data.message}
    </p>
    `;
});

socket.on('chat:typing', data => {
    actions.innerHTML = `
        <p>
            <em>${data} is typing...</em>
        </p>
    `;
});