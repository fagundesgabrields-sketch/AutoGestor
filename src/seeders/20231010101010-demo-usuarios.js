const bcrypt = require('bcrypt');

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashGestor = await bcrypt.hash('123456', 10);
    const hashRecepcao = await bcrypt.hash('123456', 10);
    const hashMecanico = await bcrypt.hash('123456', 10);

    return queryInterface.bulkInsert('usuarios', [
      {
        nome: 'Gestor Principal',
        login: 'gestor',
        senha: hashGestor,
        perfil: 'gestor'
      },
      {
        nome: 'Recepção 1',
        login: 'recepcao',
        senha: hashRecepcao,
        perfil: 'recepcao'
      },
      {
        nome: 'Mecânico 1',
        login: 'mecanico',
        senha: hashMecanico,
        perfil: 'mecanico'
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('usuarios', null, {});
  }
};
