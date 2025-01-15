const sendMessage = require('../../services/Wp-Envio-Msj/sendMessage');
const sendMessageTarget = require('../../services/Wp-Envio-Msj/sendMessageTarget');
const userService = require('../../services/userService');

const handleEventsConfirmation = async (senderId, receivedMessage) => {
  console.log(`Mensaje recibido de ${senderId}: ${receivedMessage}`);

  // Verificar si el mensaje es exactamente "eventos_mes"
  if (receivedMessage.toLowerCase() !== 'eventos_mes') {
    // Si el mensaje no es "eventos_mes", volver a enviar la tarjeta con el mismo botón
    const retryMessage = '¿Te gustaría saber qué eventos tiene AMPI este mes?';
    const buttons = [
      { id: 'eventos_mes', title: 'Eventos del mes' }
    ];
    await sendMessageTarget(senderId, retryMessage, buttons);
    return;
  }

  // Detalles de los eventos
  const eventsMessage = `
    **Ventas y Finanzas**
    Ponente: Carlos Slim
    Lugar: Auditorio Telmex, Plaza Carso
    Fecha: 1 de Febrero 19:00 Hrs
    Precio regular: $10,000
    Precio miembro AMPI: $5,500

    **Estrategia y Planeación (Desayuno)**
    Ponente: Alejandro Rodríguez
    Lugar: Club de Banqueros
    Fecha: 5 de Febrero 11:00 Hrs
    Precio regular: $7,000
    Precio miembro AMPI: $500
  `;
  
  // Enviar los detalles de los eventos
  await sendMessage(senderId, eventsMessage);

  // Mensaje de seguimiento
  const followUpMessage = '¿Te interesa alguno de estos eventos?';

  // Tarjeta con botones de opciones
  const buttons = [
    { id: 'eventocslim', title: 'Evento Carlos Slim' }
  ];

  // Enviar el mensaje con la tarjeta
  await sendMessageTarget(senderId, followUpMessage, buttons);

  // Actualizar el estado a 'eventoseleccion'
  await userService.updateUser(senderId, { estado: 'eventoseleccion' });
  console.log(`Estado actualizado a eventoseleccion`);
};


module.exports = handleEventsConfirmation;
