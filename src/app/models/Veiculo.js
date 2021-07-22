const {Model} = require('sequelize');
const {Sequelize} = require('sequelize');

class Veiculo extends Model{
  static init(sequelize){
    super.init({
      placa: Sequelize.STRING,
      marca: Sequelize.STRING,
      modelo: Sequelize.STRING,
      ano: Sequelize.NUMBER,
      motor: Sequelize. STRING
    },
    {
      sequelize,
    }
    );
    return this;
  };
  static associate(models){
    this.belongsTo(models.User, {foreignKey:'user', as:'user_id'});
  }
}
module.exports = Veiculo;