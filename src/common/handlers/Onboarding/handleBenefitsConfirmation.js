const sendMessage = require('../../services/Wp-Envio-Msj/sendMessage');
const sendMessageTarget = require('../../services/Wp-Envio-Msj/sendMessageTarget');
const userService = require('../../services/userService');

const handleBenefitsConfirmation = async (senderId, receivedMessage) => {
  console.log(`Mensaje recibido de ${senderId}: ${receivedMessage}`);

  // Verificar si el mensaje es exactamente "beneficios"
  if (receivedMessage.toLowerCase() !== 'beneficios') {
    // Si el mensaje no es "beneficios", volver a enviar la tarjeta con el mismo botón
    const retryMessage = '¿Te gustaría saber los beneficios como miembro de AMPI?';
    const buttons = [
      { id: 'beneficios', title: 'Beneficios' }  // Botón de respuesta corto
    ];
    await sendMessageTarget(senderId, retryMessage, buttons);
    return;
  }

  // Enviar los beneficios del miembro
  const benefitsMessage = `
    Tus beneficios como miembro de AMPI son muchos, y seguirán creciendo.
    Aquí tienes algunos de ellos:

    **Starbucks**
    $20% de descuento con tu credencial al pagar en caja.

    **Hoteles Misión**
    5% de descuento en reservaciones de hotel en México.

    **Vips**
    15% de descuento en desayunos y cenas.
    20% de descuento en comidas.

   
  `;
  
 
  // Enviar los beneficios y el mensaje adicional
  await sendMessage(senderId, benefitsMessage);
  await delay(1000);  // Espera 3 segundos

  // Tarjeta con el nuevo botón: Qué eventos tienen este mes?
  const eventButtonMessage = '¿Te gustaría saber qué eventos tiene AMPI este mes?';
  const buttons = [
    { id: 'eventos_mes', title: 'Eventos del mes' }
  ];

  await sendMessageTarget(senderId, eventButtonMessage, buttons);

  // Actualizar el estado a 'eventos'
  await userService.updateUser(senderId, { estado: 'eventos' });
  console.log(`Estado actualizado a eventos`);
};
// Función de retraso
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));


module.exports = handleBenefitsConfirmation;
