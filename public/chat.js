document.onload = () => {
    init();
};

// io es una variable accesible cuando se lo requirio en index.html
const socket = io();

// DOM elements
let message = document.getElementById("message");
let username = document.getElementById("username");
let btn_send = document.getElementById("send");
let output = document.getElementById("output");
let actions = document.getElementById("actions");
const btn_newUser = document.querySelector('#submit-newUser');
const newName = document.querySelector('#new-username');
const newPass = document.querySelector('#new-pass');

btn_newUser.addEventListener('click', () => {    
    // mandasr solocitud POST  /new
    console.log("perolaputamadreqlpario");
    fetch('/newUser', {
        method: 'POST', 
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify({name: newName, pass: newPass})
    })
    .then(res => res.json())
    .then(data => {
        showUserCreated(newName);
    });
    
    // actualizar lista de usuarios
    loadUsers();
    
    // mostrar mensaje de error/exito
    
    
});

function loadUsers() {
    fetch('/users', {method: 'GET'})
    .then(res => res.json())
    .then(data => {
        const users = document.querySelector('#users-container');
        let html = '';
        data.users.forEach(user => {
            html += `<div>${user.name}</div>`;
        });
        users.innerHTML = html;
    });
}

function showUserCreated(newName) {
    const inicioSesionDiv = document.querySelector('#inicio-sesion');
    inicioSesionDiv.innerHTML = `<p>Hello ${newName}!</p>`; 
}

btn_send.addEventListener('click', function () {
    let data = {
        username: username.innerHTML,
        message: message.value
    };

    socket.emit('chat:message', data);
});

message.addEventListener('keypress', () => {
    socket.emit('chat:typing', username.innerHTML);
});


// Esta data que llega fue definida en el eventListener del btn, mas arriba
//   enviada al srv por un clinete, y devuelta a este evento desde el srv
//   para todos los clientes
socket.on('chat:message', data => {
    actions.innerHTML = '';

    // borrar mensaje al ser correctamente enviado
    message.value = '';
    output.innerHTML += `
    <p>
        <strong>${data.username}</strong>: ${data.message}
    </p>
    `;
});

socket.on('chat:typing', data => {
    console.log(data);
    actions.innerHTML = `
        <p>
            <em>${data} is typing...</em>
        </p>
    `;
});