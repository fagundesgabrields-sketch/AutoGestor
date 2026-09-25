const express = require('express');
const path = require('path');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');

const app = express();

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// View Engine
app.use(expressLayouts);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Session
app.use(session({
  secret: process.env.SESSION_SECRET || require('crypto').randomBytes(32).toString('hex'),
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Routes
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const clientesRoutes = require('./routes/clientes');
const veiculosRoutes = require('./routes/veiculos');
const mecanicosRoutes = require('./routes/mecanicos');
const servicosRoutes = require('./routes/servicos');
const pecasRoutes = require('./routes/pecas');
const osRoutes = require('./routes/ordens_servico');
const relatoriosRoutes = require('./routes/relatorios');

app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/clientes', clientesRoutes);
app.use('/veiculos', veiculosRoutes);
app.use('/mecanicos', mecanicosRoutes);
app.use('/servicos', servicosRoutes);
app.use('/pecas', pecasRoutes);
app.use('/ordens-servico', osRoutes);
app.use('/relatorios', relatoriosRoutes);

app.use('/configuracoes', (req, res) => {
  res.render('configuracoes/index', { usuario: req.session.usuario || { nome: 'Admin' } });
});

app.get('/', (req, res) => {
  res.redirect('/auth/login');
});

module.exports = app;
