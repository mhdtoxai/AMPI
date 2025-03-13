const userService = require('../../services/userService');
const sendMessageTarget = require('../../services/Wp-Envio-Msj/sendMessageTarget');

const handlewelcome = async (senderId, receivedMessage) => {
  console.log(`Mensaje recibido de ${senderId}: ${receivedMessage}`);

  if (receivedMessage.toLowerCase() === 'si') {
    // Si el usuario responde "sí", se actualiza el estado y se solicita el correo
    await userService.updateUser(senderId, { estado: 'solicitudcorreo' });
    console.log(`Estado actualizado a 'solicitudcorreo'`);

    const requestEmailMessage = '¡Excelente! Por favor indícame el correo con el que estás registrado con AMPI.';
    await sendMessageTarget(senderId, requestEmailMessage);

    
  } else if (receivedMessage.toLowerCase() === 'no') {
    // Si el usuario responde "no", se actualiza el estado y se envía la invitación
    await userService.updateUser(senderId, { estado: 'no_miembro' });
    console.log(`Estado actualizado a 'no_miembro'`);

    const buttons = [{ id: 'si', title: 'Sí' }];
    const inviteMessage = 'Nos encantaría que formes parte de la familia AMPI. ¿Te gustaría conocer más sobre lo que hacemos?';
    await sendMessageTarget(senderId, inviteMessage, buttons);
  } else {
    // Si el usuario responde algo diferente, se repite la pregunta con los botones
    const buttons = [
      { id: 'si', title: 'Sí' },
      { id: 'no', title: 'No' }
    ];
    await sendMessageTarget(senderId, 'Por favor, responde con "Sí" o "No". ¿Ya eres miembro de AMPI?', buttons);
  }
};

module.exports = handlewelcome;
