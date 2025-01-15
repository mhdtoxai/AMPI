const db = require('../database/firebaseConfig');

exports.getUser = (userId) => {
  return db.collection('usuariosampi').doc(userId).get();
};

exports.createUser = (userId) => {
  return db.collection('usuariosampi').doc(userId).set({
    estado: 'bienvenida',
  });
};

exports.updateUser = (userId, data) => {
  return db.collection('usuariosampi').doc(userId).update(data);
};

