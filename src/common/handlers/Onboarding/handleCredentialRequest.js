const sendMessage = require('../../services/Wp-Envio-Msj/sendMessage');
const sendImageMessage = require('../../services/Wp-Envio-Msj/sendImageMessage');
const sendMessageTarget = require('../../services/Wp-Envio-Msj/sendMessageTarget');
const userService = require('../../services/userService');

const handleCredentialRequest = async (senderId, receivedMessage) => {
    console.log(`Mensaje recibido de ${senderId}: ${receivedMessage}`);

    // Convertir el mensaje a minúsculas y verificar si contiene la palabra 'credencial'
    const messageLowerCase = receivedMessage.toLowerCase();

    if (!messageLowerCase.includes('credencial')) {
        // Si el mensaje no contiene 'credencial', enviar un mensaje de error
        const noCredentialMessage = 'No encontré una solicitud relacionada con la credencial';
        await sendMessage(senderId, noCredentialMessage);
        return;
    }

    // Si el mensaje contiene 'credencial', enviar la credencial virtual
    const credentialMessage = 'Claro Manuel, aquí tienes tu credencial virtual de AMPI';
    // Enviar la imagen de la credencial
    const imageUrl = 'https://firebasestorage.googleapis.com/v0/b/dtox-ai-a6f48.appspot.com/o/AMPI%20Credencial.JPG?alt=media&token=2b93ce85-f071-4de4-8ec2-d7c2250e4a44';
    // Enviar mensaje preguntando si necesita más ayuda
 
    await sendMessage(senderId, credentialMessage);
    await sendImageMessage(senderId, imageUrl); // Envía la URL de la imagen como un mensaje
    await delay(2000);  // Espera 3 segundos
  
    // Enviar la tarjeta con la opción "No, gracias"
    const buttons = [
        { id: 'no', title: 'No, gracias' }
    ];
    const noThanksMessage = '¿Hay algo más en que te pueda ayudar?';
    await sendMessageTarget(senderId, noThanksMessage, buttons);

    // Actualizar el estado a 'aceptarayuda'
    await userService.updateUser(senderId, { estado: 'aceptarayuda' });
    console.log(`Estado actualizado a 'aceptarayuda'`);
};

// Función de retraso
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

module.exports = handleCredentialRequest;
