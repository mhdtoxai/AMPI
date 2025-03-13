const userService = require('../../../services/userService');
const sendMessageTarget = require('../../../services/Wp-Envio-Msj/sendMessageTarget');
const sendMessage = require('../../../services/Wp-Envio-Msj/sendMessage');

const handleAfilation = async (senderId, receivedMessage) => {
    console.log(`Mensaje recibido de ${senderId}: ${receivedMessage}`);

    if (receivedMessage !== 'si') {
        // Si el usuario no responde "Sí", se le pregunta si esta de acuerdo con el codigo
        const buttons = [
            { id: 'si', title: 'Sí' }
        ];
        await sendMessageTarget(senderId, 'Nos encantaría que formes parte de la familia AMPI. ¿Te gustaría conocer más sobre lo que hacemos?', buttons);
        return;
    }

    // Actualizar el estado en la BD
    await userService.updateUser(senderId, { estado: 'confirmacionmiembro' });
    console.log(`Estado actualizado a 'confirmacionmiembro'`);

    const info = 'La Asociación Mexicana de Profesionales Inmobiliarios (AMPI) es el organismo más grande del sector inmobiliario en México, con más de 7,000 miembros.\n\n' +
    'Ofrecemos capacitación continua, acceso a eventos nacionales, oportunidades de negocio y beneficios exclusivos, como descuentos en seguros y capital de trabajo. ' +
    'Fortalecemos la red y la profesionalización del sector inmobiliario.';

    await sendMessage(senderId, info);
    
    const buttons = [
        { id: 'si', title: 'Sí' }
    ];
    const interested = '¿Te interesa afiliarte? Tenemos promociones para nuevos miembros :)';

    await sendMessageTarget(senderId, interested, buttons);
};


module.exports = handleAfilation;