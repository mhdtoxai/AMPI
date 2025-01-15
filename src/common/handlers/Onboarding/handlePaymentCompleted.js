const sendMessage = require('../../services/Wp-Envio-Msj/sendMessage');
const sendMessageTarget = require('../../services/Wp-Envio-Msj/sendMessageTarget');
const userService = require('../../services/userService');


const handlePaymentCompleted = async (senderId) => {
  // Confirmación del pago
  const paymentConfirmationMessage = 'Muchas felicidades, tu familia AMPI agradece tu pago.';

  // Mensaje con detalles sobre la membresía activa
  const membershipMessage = 'Tu membresía estará activa hasta 1 de Febrero de 2025.\n\nY no te preocupes, te estaré recordando 30 días antes para que no se te pase :)';

  // Tarjeta con botones
  const buttons = [
    { id: 'gracias', title: 'Gracias' },
  ];

  // Enviar el primer mensaje de confirmación
  await sendMessage(senderId, paymentConfirmationMessage);

  // Enviar la tarjeta con el botón "Gracias"
  await sendMessageTarget(senderId, membershipMessage, buttons);

  await userService.updateUser(senderId, { estado: 'pagogracias' });
  console.log(`Estado actualizado a 'pagogracias'`);

};

module.exports = handlePaymentCompleted;
