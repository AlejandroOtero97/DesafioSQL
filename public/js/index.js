const socket = io();

socket.on('connectionToServer', async ({ productsData, MessagesData }) => {
    await resolveData('formProducts', 'templates/products.handlebars', {});
    await resolveData('mensajes', 'templates/messages.handlebars', {});
    productsUpdate(productsData);
    messagesUpdate(MessagesData);
    getProductsValue();
    getMessagesValue();
});

socket.on('actualizarTabla', ({ productsData }) => {
    productsUpdate(productsData);
});

socket.on('actualizarMensajes', ({ MessagesData }) => {
    messagesUpdate(MessagesData);
})

const productsUpdate = async (productsData) => {
    let factor = {  titulo:"Productos", 
                    productsData, 
                    hayProductos: productsData.length > 0, 
                    total: productsData.length 
                };
    resolveData('tableProducts', 'templates/result.handlebars', factor);
}

const messagesUpdate = async (MessagesData) => {
    let factor = {  MessagesData, 
                    messageCount: MessagesData.length > 0 }
    await resolveData('tableMensajes', 'templates/chat.handlebars', factor);
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
            alert('Fill all the fields')
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
            alert('Fill all the fields')
        }
    })
}

async function resolveData(id, template, factor) {
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