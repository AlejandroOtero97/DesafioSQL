import KnexConfig from './knexController.js';
import { createTableProductos, createTableMensajes } from '../DB/createTable.js';
import { productsMariadb, messagesSql } from "../DB/config.js"

const productos = new KnexConfig(productsMariadb, "productos", createTableProductos);
const mensajes = new KnexConfig(messagesSql, "mensajes", createTableMensajes);

async function socketController(socket, io) {
    const productsData = await productos.getAll();
    const MessagesData = await mensajes.getAll();
    socket.emit('connectionToServer', { productsData, MessagesData })

    socket.on('agregarProducto', async (data) => {
        await productos.save(data);
        io.sockets.emit('actualizarTabla', { productsData: await productos.getAll() })
    })
    socket.on("enviarMensaje", async (data) => {
        await mensajes.save(data);
        io.sockets.emit('actualizarMensajes', { MessagesData: await mensajes.getAll() })
    })

}

export default socketController;