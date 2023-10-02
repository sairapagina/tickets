import TicketControl from '../models/ticket-control.js'; // Asegúrate de que la ruta sea correcta y de usar la extensión .mjs si corresponde

const ticketControl = new TicketControl();

const socketController = (socket) => {
    socket.emit('ultimo-ticket', ticketControl.ultimo);
    socket.emit('estado-actual', ticketControl.ultimos4);
    socket.emit('tickets-pendientes', ticketControl.tickets.length);

    socket.on('siguiente-ticket', (payload, callback) => {
        const siguiente = ticketControl.siguiente();
        callback(siguiente);

        // TODO: Notificar que hay un nuevo ticket pendiente de asignar
        socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length);
    });

    socket.on('atender-ticket', ({ escritorio }, callback) => {
        if (!escritorio) {
            return callback({
                ok: false,
                msg: 'El escritorio es obligatorio',
            });
        }

        const ticket = ticketControl.atenderTicket(escritorio);

        // TODO: Notificar cambio en los ultimos4
        socket.broadcast.emit('estado-actual', ticketControl.ultimos4);
        // Emitir para el propio usuario de 'atender-ticket'
        socket.emit('tickets-pendientes', ticketControl.tickets.length);
        // Emitir para todos los usuarios menos el que emite el 'atender-ticket'
        socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length);

        if (!ticket) {
            callback({
                ok: false,
                msg: 'Ya no hay tickets pendientes',
            });
        } else {
            callback({
                ok: true,
                ticket,
                pendientes: ticketControl.tickets.length,
            });
        }
    });
}

export default socketController 