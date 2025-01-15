const sendMessage = require('../../services/Wp-Envio-Msj/sendMessage');
const sendMessageTarget = require('../../services/Wp-Envio-Msj/sendMessageTarget');
const userService = require('../../services/userService');
const handlePaymentPendientEvent = require('../../handlers/Onboarding/handlePaymentPendientEvent');

const handleTicketConfirmation = async (senderId, receivedMessage) => {
  console.log(`Mensaje recibido de ${senderId}: ${receivedMessage}`);

  if (receivedMessage === '1') {
    // Si seleccionó "1", proceder con el proceso de pago con tarjeta de crédito
    await userService.updateUser(senderId, { estado: 'pagopendienteevento' });
    console.log(`Estado actualizado a pagopendienteevento`);
    await handlePaymentPendientEvent(senderId);
  } else if (receivedMessage === '2' || receivedMessage === '3') {
    // Si seleccionó "2" o "3", enviar el mensaje de seguridad
    const safetyMessage = 'Por seguridad al adquirir más de 2 boletos te pedimos ingresar a wechamber.mx. Si necesitas más ayuda, con gusto estoy para asistirte.';
    await sendMessage(senderId, safetyMessage);

    // Luego, enviar el mensaje de ayuda adicional con botones
    const buttons = [
      { id: 'no', title: 'No, gracias' }
    ];
    const retryMessage = '¿Algo más en que te pueda ayudar?';
    await sendMessageTarget(senderId, retryMessage, buttons);

    // Actualizar el estado a 'contactocard'
    await userService.updateUser(senderId, { estado: 'contactocard' });
    console.log(`Estado actualizado a 'contactocard'`);
  } else {
    // Si no seleccionó una opción válida, volver a enviar la tarjeta con opciones
    const boletosButtons = [
      { id: '1', title: '1' },
      { id: '2', title: '2' },
      { id: '3', title: '3' }
    ];
    const retryMessage = 'Elije la cantidad de boletos que requieres';
    await sendMessageTarget(senderId, retryMessage, boletosButtons);
  }
};

module.exports = handleTicketConfirmation;
