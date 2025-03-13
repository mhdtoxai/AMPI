const userService = require('../../../services/userService');
const sendMessage = require('../../../services/Wp-Envio-Msj/sendMessage');

const handleAfilation = async (senderId, receivedMessage) => {
    console.log(`Mensaje recibido de ${senderId}: ${receivedMessage}`);

    // Validar si el mensaje parece un nombre (al menos dos palabras con letras)
    const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:\s[A-Za-zÀ-ÖØ-öø-ÿ]+)+$/;

    if (!nameRegex.test(receivedMessage)) {
        // Si no parece un nombre válido, se vuelve a preguntar
        await sendMessage(senderId, 'Por favor, ingresa tu nombre completo para continuar con el proceso de afiliación.');
        return;
    }

    // Guardar el nombre en la base de datos y actualizar el estado
    await userService.updateUser(senderId, { estado: 'no_member_phone', nombre: receivedMessage });
    console.log(`Estado actualizado a 'no_member_phone' y nombre guardado: ${receivedMessage}`);

    await sendMessage(senderId, 'Ahora, un teléfono de contacto de 10 dígitos.');
};

module.exports = handleAfilation;
