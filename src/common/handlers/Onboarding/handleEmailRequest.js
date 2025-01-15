const userService = require('../../services/userService');
const sendMessage = require('../../services/Wp-Envio-Msj/sendMessage');
const sendMessageTarget = require('../../services/Wp-Envio-Msj/sendMessageTarget');

const handleEmailRequest = async (senderId, receivedMessage) => {
    console.log(`Mensaje recibido de ${senderId}: ${receivedMessage}`);

    if (!receivedMessage || !isValidEmail(receivedMessage)) {
        // Si el mensaje no contiene un correo válido, pide nuevamente el correo
        const requestEmailMessage = 'Por favor, indícame un correo válido con el que estás registrado con AMPI.';
        await sendMessage(senderId, requestEmailMessage);
        return;
    }

    // Actualizar el estado y almacenar el correo en la base de datos
    await userService.updateUser(senderId, { correo: receivedMessage, estado: 'confirmarsolicitudcodigo' });
    console.log(`Correo actualizado a '${receivedMessage}' y estado a 'confirmarsolicitudcodigo'`);

    // Enviar mensaje normal
    const confirmationMessage = '¡Perfecto!';
    await sendMessage(senderId, confirmationMessage);

    // Enviar mensaje en modo tarjeta
    const buttons = [
        { id: 'si', title: 'Sí' } // Aquí puedes añadir más botones si es necesario
    ];
    const securityMessage = 'Por seguridad te enviaré un Código Único a tu correo electrónico. Tiene 5 minutos de vigencia.';
    await sendMessageTarget(senderId, securityMessage);
    // Enviar mensaje adicional con "¿De acuerdo?"
    const agreementMessage = '¿De acuerdo?';
    await sendMessageTarget(senderId, agreementMessage, buttons); // Usamos los mismos botones
};


// Función auxiliar para validar el formato del correo electrónico
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

module.exports = handleEmailRequest;
