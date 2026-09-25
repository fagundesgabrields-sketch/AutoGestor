const bcrypt = require('bcrypt');
const { Usuario } = require('../models');

module.exports = {
  loginForm: (req, res) => {
    if (req.session.usuario) {
      return res.redirect('/dashboard');
    }
    res.render('auth/login', { layout: false, error: null });
  },

  login: async (req, res) => {
    try {
      const { login, senha } = req.body;
      const usuario = await Usuario.findOne({ where: { login } });

      if (!usuario) {
        return res.render('auth/login', { layout: false, error: 'Usuário ou senha inválidos' });
      }

      const match = await bcrypt.compare(senha, usuario.senha);
      if (!match) {
        return res.render('auth/login', { layout: false, error: 'Usuário ou senha inválidos' });
      }

      req.session.usuario = {
        id: usuario.id,
        nome: usuario.nome,
        perfil: usuario.perfil
      };

      res.redirect('/dashboard');
    } catch (error) {
      res.render('auth/login', { layout: false, error: 'Erro ao fazer login' });
    }
  },

  logout: (req, res) => {
    req.session.destroy();
    res.redirect('/auth/login');
  }
};
