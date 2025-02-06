


const userService = require('./userService');
const sendMessageTarget = require('./Wp-Envio-Msj/sendMessageTarget');
const sendMessage = require('./Wp-Envio-Msj/sendMessage');
const handlewelcome = require('../handlers/Onboarding/handlewelcome');
const handleEmailRequest = require('../handlers/Onboarding/handleEmailRequest');
const handleConfirmCode = require('../handlers/Onboarding/handleConfirmCode');
const handleCodeValidation = require('../handlers/Onboarding/handleCodeValidation');
const handleCredentialRequest = require('../handlers/Onboarding/handleCredentialRequest');
const handleNoThanksHelp = require('../handlers/Onboarding/handleNoThanksHelp');
const handleRenewalResponse = require('../handlers/Onboarding/handleRenewalResponse');
const handlePaymentMethod = require('../handlers/Onboarding/handlePaymentMethod');
const handlePaymentPendient = require('../handlers/Onboarding/handlePaymentPendient');
// const handlePaymentCompleted = require('../handlers/Onboarding/handlePaymentCompleted');
const handlePaymentThanksResponse = require('../handlers/Onboarding/handlePaymentThanksResponse');
const handleBenefitsConfirmation = require('../handlers/Onboarding/handleBenefitsConfirmation');
const handleEventsConfirmation = require('../handlers/Onboarding/handleEventsConfirmation');
const handleEventSelect = require('../handlers/Onboarding/handleEventSelect');
const handlePaymentMethodEvent = require('../handlers/Onboarding/handlePaymentMethodEvent');
const handlePaymentPendientEvent = require('../handlers/Onboarding/handlePaymentPendientEvent');
const handleEventPaymentCompleted = require('../handlers/Onboarding/handleEventPaymentCompleted');
const handleConfirmAgend = require('../handlers/Onboarding/handleConfirmAgend');

const handleUserByState = async (senderId, receivedMessage) => {
  const userDoc = await userService.getUser(senderId);

  if (!userDoc.exists) {
    await userService.createUser(senderId);

    // Enviar mensaje normal antes de la tarjeta
    await sendMessage(senderId, '¡Hola! Bienvenido al Smart Agent AI de AMPI, estoy aquí para ayudarte en todo lo relacionado con nuestra asociación.');

    const buttons = [
      { id: 'si', title: 'Sí' }
    ];

    // Enviar tarjeta con la pregunta modificada
    await sendMessageTarget(senderId, '¿Ya eres miembro de AMPI?', buttons);
  } else {

    const userData = userDoc.data();
    const estado = userData.estado;

    switch (estado) {
      case 'bienvenida':
        await handlewelcome(senderId, receivedMessage);
        break;
      case 'solicitudcorreo':
        await handleEmailRequest(senderId, receivedMessage);
        break;
      case 'confirmarsolicitudcodigo':
        await handleConfirmCode(senderId, receivedMessage);
        break;
      case 'solicitudcodigo':
        await handleCodeValidation(senderId, receivedMessage);
        break;
      case 'credencial':
        await handleCredentialRequest(senderId, receivedMessage);
        break;
      case 'aceptarayuda':
        await handleNoThanksHelp(senderId, receivedMessage);
        break;
      case 'metodopago':
        await handleRenewalResponse(senderId, receivedMessage);
        break;
      case 'tdc':
        await handlePaymentMethod(senderId, receivedMessage);
        break;
      case 'pagopendiente':
        await handlePaymentPendient(senderId, receivedMessage);
        break;
      // case 'pagado':
      //   await handlePaymentCompleted(senderId, receivedMessage);
      //   break;
      case 'pagogracias':
        await handlePaymentThanksResponse(senderId, receivedMessage);
        break;
      case 'beneficios':
        await handleBenefitsConfirmation(senderId, receivedMessage);
        break;
      case 'eventos':
        await handleEventsConfirmation(senderId, receivedMessage);
        break;
      case 'eventoseleccion':
        await handleEventSelect(senderId, receivedMessage);
        break;
      case 'confirmarevento':
        await handleConfirmAgend(senderId, receivedMessage);
        break;
 
    }
  }
};


module.exports = handleUserByState;
