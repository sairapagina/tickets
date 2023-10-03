import 'dotenv/config' 
import  express  from "express";
import controllerSockets from "./sockets/controller.js"
import http from 'http'
import * as io from 'socket.io'

const port=process.env.PORT
let app = express();
app.use(express.json());
app.use(express.static('public'))
const server = http.createServer(app)

let ioServer = new io.Server(server);
app.set('socketio', io)

ioServer.on('connection', controllerSockets);

server.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});