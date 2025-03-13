const userService = require('../../../services/userService');
const sendMessage = require('../../../services/Wp-Envio-Msj/sendMessage');
const sendMessageTarget = require('../../../services/Wp-Envio-Msj/sendMessageTarget');

const handleprocessEmailRequest = async (senderId, receivedMessage) => {
    console.log(`Mensaje recibido de ${senderId}: ${receivedMessage}`);

    // Expresión regular para validar correos electrónicos
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(receivedMessage)) {
        // Si el correo no es válido, se vuelve a pedir
        await sendMessage(senderId, 'El correo ingresado no es válido. Por favor, envía un correo electrónico válido (ejemplo: usuario@dominio.com).');
        return;
    }

    // Guardar el correo en la base de datos y actualizar el estado
    await userService.updateUser(senderId, { estado: 'confirm_email', correo: receivedMessage });
    console.log(`Estado actualizado a 'confirm_email' y correo guardado: ${receivedMessage}`);

    const buttons = [
        { id: 'correcto', title: 'Es Correcto' }
    ];
    
    await sendMessageTarget(senderId, `Por favor confirma que tu correo esté bien escrito: ${receivedMessage}`, buttons);
    

};

module.exports = handleprocessEmailRequest;
