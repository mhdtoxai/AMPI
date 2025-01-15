const sendMessage = require('../../services/Wp-Envio-Msj/sendMessage');
const sendMessageTarget = require('../../services/Wp-Envio-Msj/sendMessageTarget');
const userService = require('../../services/userService');

const handleEmailTicket = async (senderId, receivedMessage) => {

    console.log(`Mensaje recibido de ${senderId}: ${receivedMessage}`);

    if (receivedMessage !== 'si') {
      // Si el usuario no responde "Sí", se le pregunta si esta de acuerdo con el codigo
      const buttons = [
        { id: 'si', title: 'Sí' }
      ];
      await sendMessageTarget(senderId, '¿De acuerdo?', buttons);
      return;
    }
  
  // Mensaje con detalles sobre la membresía activa
  const membershipMessage = 'Gustas que lo agregue a tu agenda?';

  // Tarjeta con botones
  const buttons = [
    { id: 'si', title: 'Si' },
  ];

  // Enviar la tarjeta con el botón "Gracias"
  await sendMessageTarget(senderId, membershipMessage, buttons);

  await userService.updateUser(senderId, { estado: 'confirmaragenda' });
  console.log(`Estado actualizado a 'confirmaragenda'`);

};


module.exports = handleEmailTicket;
