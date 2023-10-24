import  {io} from "socket.io-client";

const socket = io('127.0.0.1:8080');
//nodejs-production-0bf5.up.railway.app
//Aqui se cambia adonde se va a hostear el app.
//Se uso railway de prueba, se podria usar localhost o algun otro servicio.
export default socket;
