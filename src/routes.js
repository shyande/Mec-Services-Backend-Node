const {Router} = require('express');
const routes = new Router();

const UserController = require('./app/controllers/UserController');
const EmpresaController = require('./app/controllers/EmpresaController');
const SessionController = require('./app/controllers/SessionController');
const SessionEmpresaController = require('./app/controllers/SessionEmpresaController');
const DisponibilidadeController = require('./app/controllers/DisponibilidadeController');
const VeiculoController = require('./app/controllers/VeiculoController');
const AgendamentoController = require('./app/controllers/AgendamentoController');
const authMiddleware = require('./middlewares/auth');

routes.post('/cadastrarUsuario', UserController.store);
routes.post('/cadastrarEmpresa', EmpresaController.store);
routes.post('/login', SessionController.store);
routes.post('/empresaLogin', SessionEmpresaController.store);

//Middleware de autenticação, rotas abaixo exigem token.
routes.use(authMiddleware);

routes.put('/atualizarCadastro', UserController.update);
routes.put('/atualizarCadastroEmpresa', EmpresaController.update);
routes.get('/dadosEmpresa', EmpresaController.show);

routes.post('/cadastrarDisponibilidade', DisponibilidadeController.store);
routes.get('/verificarDisponibilidade', DisponibilidadeController.index);
routes.get('/disponibilidades', DisponibilidadeController.show);
routes.get('/agendamentosDoDia', DisponibilidadeController.findDay);

routes.post('/cadastrarVeiculo', VeiculoController.store);
routes.put('/atualizarVeiculo/:id', VeiculoController.update);
routes.get('/meusVeiculos', VeiculoController.show);

routes.post('/cadastrarAgendamento', AgendamentoController.store);
routes.delete('/cancelarAgendamento/:id', AgendamentoController.delete);
routes.get('/pesquisarAgendamento', AgendamentoController.index);
routes.put('/atualizarAgendamento/:id', AgendamentoController.update);
routes.get('/pesquisarAgendamentos', AgendamentoController.show);
routes.get('/agendamentosCancelados', AgendamentoController.findCandeled);





module.exports = routes;