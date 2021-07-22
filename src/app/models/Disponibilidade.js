const {Model} = require('sequelize');
const {Sequelize} = require('sequelize');

const {isBefore} = require('date-fns');

class Disponibilidade extends Model{
  static init(sequelize){
    super.init({
      date: Sequelize.DATE,
      hour: Sequelize.NUMBER,
      status_disponibilidade:{
        type: Sequelize.VIRTUAL,
        get(){
          return isBefore(this.date, new Date());
        },
      },
    },
    {
      sequelize,
    }
    )
    return this;
  }
}

module.exports = Disponibilidade;