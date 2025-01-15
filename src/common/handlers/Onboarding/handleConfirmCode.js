const userService = require('../../services/userService');
const sendMessageTarget = require('../../services/Wp-Envio-Msj/sendMessageTarget');

const handlewelcome = async (senderId, receivedMessage) => {
  console.log(`Mensaje recibido de ${senderId}: ${receivedMessage}`);

  if (receivedMessage !== 'si') {
    // Si el usuario no responde "Sí", se le pregunta si esta de acuerdo con el codigo
    const buttons = [
      { id: 'si', title: 'Sí' }
    ];
    await sendMessageTarget(senderId, '¿De acuerdo?', buttons);
    return;
  }

  // Actualizar el estado en la BD
  await userService.updateUser(senderId, { estado: 'solicitudcodigo' });
  console.log(`Estado actualizado a 'solicitudcodigo'`);

  // Enviar el mensaje para solicitar el correo
  const requestEmailMessage = 'Por favor ingresa tu código único';
  await sendMessageTarget(senderId, requestEmailMessage);
};


module.exports = handlewelcome;
