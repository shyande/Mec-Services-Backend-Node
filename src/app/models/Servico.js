const {Model} = require('sequelize');
const {Sequelize} = require('sequelize');

class Servico extends Model{
    static init(sequelize){
      super.init({
        tipo_servico:Sequelize.STRING,
        tempo_estimado: Sequelize.STRING,
      },
      {
        sequelize,
      }
      );
      return this;
    }
}

module.exports = Servico;