const {Model} = require('sequelize');
const {Sequelize} = require('sequelize');

const bcrypt = require('bcryptjs');

class Empresa extends Model{
  static init(sequelize){
    super.init({
      name: Sequelize.STRING,
      cnpj: Sequelize.STRING,
      email: Sequelize.STRING,
      password: Sequelize.VIRTUAL,
      password_hash: Sequelize.STRING,
      telefone: Sequelize.STRING,
      endereco: Sequelize.STRING,
    },
    {
      sequelize,
    }
    );
    this.addHook('beforeSave', async (empresa) => {
      if(empresa.password){
        empresa.password_hash = await bcrypt.hash(empresa.password,8);
      }
    });
    return this;
  };
  
  checkPassword(password){
    return bcrypt.compare(password, this.password_hash);
  }
}
module.exports = Empresa;