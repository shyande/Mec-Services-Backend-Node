const {Sequelize} = require('sequelize');
const mongoose = require('mongoose');
const databaseConfig = require('../config/database');

const Agendamento = require('../app/models/Agendamento');
const Disponibilidade = require('../app/models/Disponibilidade');
const Empresa = require('../app/models/Empresa');
const Servico = require('../app/models/Servico');
const User = require('../app/models/User');
const Veiculo = require('../app/models/Veiculo');

const models = [Agendamento,Disponibilidade,Empresa,Servico,User,Veiculo];

class Database{
  constructor(){
    this.init();
    this.mongo();
  }
  init(){
    this.connection = new Sequelize(databaseConfig);

    models
    .map(model => model.init(this.connection))
    .map(model => model.associate && model.associate(this.connection.models));
  }
  mongo(){
    this.mongoConnection = mongoose.connect(
      'mongodb://localhost:27017/projeto5',
      {useNewUrlParser: true, useFindAndModify: true}
    )
  }
}

module.exports = new Database();