const {Model} = require('sequelize');
const {Sequelize} = require('sequelize');

const {isBefore, subHours} = require('date-fns');

class Agendamento extends Model{
  static init(sequelize){
    super.init({
      status_agendamento: Sequelize.BOOLEAN,
      canceled_at:Sequelize.DATE,
      servico:Sequelize.STRING,
      cancelable:{
        type: Sequelize.VIRTUAL,
        get(){
          return isBefore(new Date(), subHours(this.date,2));
        }
      }
    },
    {
      sequelize,
    }
    );
    return this;
  }
  static associate(models){
    this.belongsTo(models.User, {foreignKey:'user', as: 'user_id'});
    this.belongsTo(models.Empresa, {foreignKey:'empresa', as: 'empresa_id'});
    this.belongsTo(models.Veiculo, {foreignKey:'veiculo', as: 'veiculo_id'});
    this.belongsTo(models.Disponibilidade, {foreignKey:'disponibilidade', as: 'disponibilidade_id'});
  }
}
module.exports = Agendamento;