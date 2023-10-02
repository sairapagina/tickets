// Importa io desde el módulo socket.io-client
// import { io } from 'socket.io-client';

// Referencias HTML
const lblNuevoTicket = document.querySelector('#lblNuevoTicket');
const btnCrear = document.querySelector('button');

const socket = io();

socket.on('connect', () => {
  btnCrear.disabled = false;
});

socket.on('disconnect', () => {
  btnCrear.disabled = true;
});

socket.on('ultimo-ticket', (payload) => {
  lblNuevoTicket.innerText = "Ticket " + payload;
});

btnCrear.addEventListener('click', () => {
  socket.emit('siguiente-ticket', null, (ticket) => {
    console.log('Desde el servidor', ticket);
    lblNuevoTicket.innerText = ticket;
  });
});
