const {Model} = require('sequelize');
const {Sequelize} = require('sequelize');

const {isBefore} = require('date-fns');

class Disponibilidade extends Model{
  static init(sequelize){
    super.init({
      date: Sequelize.DATE,
      status_disponibilidade: Sequelize.STRING,
      display_date: Sequelize.STRING,
      past:{
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