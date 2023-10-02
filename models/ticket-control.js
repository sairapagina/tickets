import path from 'path';
import fs from 'fs/promises'; // Importa fs con soporte para promesas
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class Ticket {
  constructor(numero, escritorio) {
    this.numero = numero;
    this.escritorio = escritorio;
  }
}

class TicketControl {
  constructor() {
    this.ultimo = 0;
    this.hoy = new Date().getDate();
    this.tickets = [];
    this.ultimos4 = [];

    this.init();
  }

  get toJson() {
    return {
      ultimo: this.ultimo,
      hoy: this.hoy,
      tickets: this.tickets,
      ultimos4: this.ultimos4,
    };
  }

  async init() {
    const dbPath = path.join(__dirname, '../db/data.json');

    try {
      const data = await fs.readFile(dbPath, 'utf-8');
      const jsonData = JSON.parse(data);

      if (jsonData.hoy === this.hoy) {
        this.tickets = jsonData.tickets;
        this.ultimo = jsonData.ultimo;
        this.ultimos4 = jsonData.ultimos4;
      } else {
        // Es otro día
        this.guardarDB();
      }
    } catch (error) {
      console.error('Error al leer el archivo de datos:', error);
      // Trata el error apropiadamente
    }
  }

  async guardarDB() {
    const dbPath = path.join(__dirname, '../db/data.json');
    try {
      await fs.writeFile(dbPath, JSON.stringify(this.toJson));
    } catch (error) {
      console.error('Error al guardar el archivo de datos:', error);
      // Trata el error apropiadamente
    }
  }

  siguiente() {
    this.ultimo += 1;
    const ticket = new Ticket(this.ultimo, null);
    this.tickets.push(ticket);

    this.guardarDB();
    return 'Ticket ' + ticket.numero;
  }

  atenderTicket(escritorio) {
    // No tenemos tickets
    if (this.tickets.length === 0) {
      return null;
    }

    const ticket = this.tickets.shift();
    ticket.escritorio = escritorio;
    this.ultimos4.unshift(ticket);

    if (this.ultimos4.length > 4) {
      this.ultimos4.splice(-1, 1);
    }

    this.guardarDB();

    return ticket;
  }
}

export default TicketControl;
