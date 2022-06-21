const socket = io();

socket.on('connectionToServer', async ({ array_productos, MessagesData }) => {
    await mostrar('formProducts', 'templates/form.handlebars', {});
    await mostrar('mensajes', 'templates/messages.handlebars', {});
    productsUpdate(array_productos);
    messagesUpdate(MessagesData);
    getProductsValue();
    getMessagesValue();
});

socket.on('actualizarTabla', ({ array_productos }) => {
    productsUpdate(array_productos);
});

socket.on('actualizarMensajes', ({ MessagesData }) => {
    messagesUpdate(MessagesData);
})

const productsUpdate = async (array_productos) => {
    let factor = { titulo:"Productos", 
                    array_productos };
    mostrar('tableProducts', 'templates/table.handlebars', factor);
}

const messagesUpdate = async (MessagesData) => {
    let factor = {  MessagesData, 
                    messageCount: MessagesData.length > 0 }
    await mostrar('tableMensajes', 'templates/tableMessages.handlebars', factor);
}

function getProductsValue() {
    const btn = document.getElementById('botonEnviar')
    btn.addEventListener('click', event => {
        const title = document.getElementById('title').value
        const price = document.getElementById('price').value
        const thumbnail = document.getElementById('thumbnail').value
        if(title.length>0 && price.length>0 && thumbnail.length>0){
            socket.emit('agregarProducto', { title, price, thumbnail })
        } else {
            alert('Todos los campos son obligatorios')
        }
    })
}

function getMessagesValue() {
    const btn2 = document.getElementById("botonEnviarMensaje")
    btn2.addEventListener('click', event => {
        const user = document.getElementById('user').value
        const mensaje = document.getElementById('mensaje').value
        if(user.length>0 && mensaje.length>0){
            socket.emit('enviarMensaje', { user, mensaje })
        } else {
            alert('Todos los campos son obligatorios')
        }
    })
}

async function mostrar(id, template, factor) {
    const divProductos = document.getElementById(id);
    divProductos.innerHTML = await armarHtmlRemoto(template, factor);
}

function armarHtmlRemoto(url, context) {
    return buscarPlantilla(url).then(plantilla => {
        const generarHtml = Handlebars.compile(plantilla);
        return generarHtml(context)
    })
}

function buscarPlantilla(url) {
    return fetch(url).then(res => res.text())
}

function eliminarProducto(id) {
    socket.emit('eliminarProducto', id);
}

function editarProducto(id) {
    const title = document.getElementById('title').value
    const price = document.getElementById('price').value
    const thumbnail = document.getElementById('thumbnail').value
    if(title.length>0 && price.length>0 && thumbnail.length>0){
        socket.emit('editarProducto', id, { title, price, thumbnail });
    } else {
        alert('Todos los campos son obligatorios')
    }
}