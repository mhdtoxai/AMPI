const sendMessage = require('../../services/Wp-Envio-Msj/sendMessage');
const sendMessageTarget = require('../../services/Wp-Envio-Msj/sendMessageTarget');
const userService = require('../../services/userService');


const handleEventPaymentCompleted = async (senderId) => {
  // Confirmación del pago
  const paymentConfirmationMessage = 'Felicidades, estás confirmado en el evento.';

  // Mensaje con detalles sobre la membresía activa
  const membershipMessage = 'Gustas que lo agregue a tu agenda?';

  // Tarjeta con botones
  const buttons = [
    { id: 'si', title: 'Si' },
  ];

  // Enviar el primer mensaje de confirmación
  await sendMessage(senderId, paymentConfirmationMessage);

  // Enviar la tarjeta con el botón "Gracias"
  await sendMessageTarget(senderId, membershipMessage, buttons);

  await userService.updateUser(senderId, { estado: 'confirmaragenda' });
  console.log(`Estado actualizado a 'confirmaragenda'`);

};


module.exports = handleEventPaymentCompleted;
