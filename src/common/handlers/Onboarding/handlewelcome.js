const userService = require('../../services/userService');
const sendMessageTarget = require('../../services/Wp-Envio-Msj/sendMessageTarget');

const handlewelcome = async (senderId, receivedMessage) => {
  console.log(`Mensaje recibido de ${senderId}: ${receivedMessage}`);

  if (receivedMessage !== 'si') {
    // Si el usuario no responde "Sí", se le pregunta si es miembro de AMPI
    const buttons = [
      { id: 'si', title: 'Sí' }
    ];
    await sendMessageTarget(senderId, '¿Ya eres miembro de AMPI?', buttons);
    return;
  }

  // Actualizar el estado en la BD
  await userService.updateUser(senderId, { estado: 'solicitudcorreo' });
  console.log(`Estado actualizado a 'solicitudcorreo'`);

  // Enviar el mensaje para solicitar el correo
  const requestEmailMessage = '¡Excelente! Por favor indícame el correo con el que estás registrado con AMPI.';
  await sendMessageTarget(senderId, requestEmailMessage);
};


module.exports = handlewelcome;
