const userService = require('./userService');
const sendMessageTarget = require('./Wp-Envio-Msj/sendMessageTarget');
const sendMessage = require('./Wp-Envio-Msj/sendMessage');
const handlewelcome = require('../handlers/Onboarding/handlewelcome');
const handleAfilation = require('../handlers/Onboarding/NoMembers/handleAfilation');
const handleConfirmationMember = require('../handlers/Onboarding/NoMembers/handleConfirmationMember');
const handleConfirmName = require('../handlers/Onboarding/NoMembers/handleConfirmName');
const handlePhoneRequest = require('../handlers/Onboarding/NoMembers/handlePhoneRequest');
const handleprocessEmailRequest = require('../handlers/Onboarding/NoMembers/handleprocessEmailRequest');
const handleConfirmEmail = require('../handlers/Onboarding/NoMembers/handleConfirmEmail');
const handleMemberHelp = require('../handlers/Onboarding/NoMembers/handleMemberHelp');





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

const handleConfirmAgend = require('../handlers/Onboarding/handleConfirmAgend');

const handleUserByState = async (senderId, receivedMessage) => {
  const userDoc = await userService.getUser(senderId);

  if (!userDoc.exists) {
    await userService.createUser(senderId);

    // Enviar mensaje normal antes de la tarjeta
    await sendMessage(senderId, 'Hola, soy el asistente inteligente de AMPI. Estoy aquí para ayudarte. ');

    const buttons = [
      { id: 'si', title: 'Sí' },
      { id: 'no', title: 'No' }
    ];

    // Enviar tarjeta con la pregunta modificada
    await sendMessageTarget(senderId, '¿Para comenzar me puedes indicar si ya eres miembro AMPI?', buttons);
  } else {

    const userData = userDoc.data();
    const estado = userData.estado;

    switch (estado) {
      case 'bienvenida':
        await handlewelcome(senderId, receivedMessage);
        break;
      case 'no_miembro':
        await handleAfilation(senderId, receivedMessage);
        break;
      case 'confirmacionmiembro':
        await handleConfirmationMember(senderId, receivedMessage);
        break;
      case 'confirmacionmiembro':
        await handleConfirmationMember(senderId, receivedMessage);
        break;
      case 'no_member_name':
        await handleConfirmName(senderId, receivedMessage);
        break;
      case 'no_member_phone':
        await handlePhoneRequest(senderId, receivedMessage);
        break;
      case 'no_member_email':
        await handleprocessEmailRequest(senderId, receivedMessage);
        break;
      case 'confirm_email':
        await handleConfirmEmail(senderId, receivedMessage);
        break;
      case 'no_member_help':
        await handleMemberHelp(senderId, receivedMessage);
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
