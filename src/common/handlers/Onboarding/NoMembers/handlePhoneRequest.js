const userService = require('../../../services/userService');
const sendMessage = require('../../../services/Wp-Envio-Msj/sendMessage');

const handlePhoneRequest = async (senderId, receivedMessage) => {
    console.log(`Mensaje recibido de ${senderId}: ${receivedMessage}`);

    // Expresión regular para validar números de teléfono (exactamente 10 dígitos)
    const phoneRegex = /^\d{10}$/;

    if (!phoneRegex.test(receivedMessage)) {
        // Si el número no es válido, se vuelve a pedir
        await sendMessage(senderId, 'El número ingresado no es válido. Por favor, envía un número de teléfono con exactamente 10 dígitos.');
        return;
    }

    // Guardar el número en la base de datos y actualizar el estado
    await userService.updateUser(senderId, { estado: 'no_member_email', telefono: receivedMessage });
    console.log(`Estado actualizado a 'no_member_email' y teléfono guardado: ${receivedMessage}`);

    await sendMessage(senderId, '¡Buen trabajo! Por último, tu correo electrónico.');
};

module.exports = handlePhoneRequest;
