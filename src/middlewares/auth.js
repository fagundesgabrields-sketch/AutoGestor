module.exports = {
  checkAuth: (req, res, next) => {
    if (req.session.usuario) {
      res.locals.usuario = req.session.usuario;
      return next();
    }
    res.redirect('/auth/login');
  },
  
  checkGestor: (req, res, next) => {
    if (req.session.usuario && req.session.usuario.perfil === 'gestor') {
      return next();
    }
    res.status(403).send('Acesso negado');
  }
};
