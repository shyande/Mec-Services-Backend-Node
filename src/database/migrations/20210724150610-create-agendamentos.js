'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
   
    await queryInterface.createTable('agendamentos', { 
      
      id:{ 
        type:Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true,
      },
      status_agendamento:{
        type:Sequelize.BOOLEAN,
        allowNull:false,
      },
      canceled_at:{
        type:Sequelize.DATE,
      },
      user:{
        type:Sequelize.INTEGER,
        references:{model:'users', key:'id'},
        onUpdate:'CASCADE',
        onDELETE:'SET NULL',
      },
      veiculo:{
        type:Sequelize.INTEGER,
        references:{model:'veiculos', key:'id'},
        onUpdate:'CASCADE',
        onDELETE:'SET NULL',
      },
      empresa:{
        type:Sequelize.INTEGER,
        references:{model:'empresas', key:'id'},
        onUpdate:'CASCADE',
        onDELETE:'SET NULL',
      },
      servico:{
        type:Sequelize.INTEGER,
        references:{model:'servicos', key:'id'},
        onUpdate:'CASCADE',
        onDELETE:'SET NULL',
      },
      disponibilidade:{
        type:Sequelize.INTEGER,
        references:{model:'disponibilidades', key:'id'},
        onUpdate:'CASCADE',
        onDELETE:'SET NULL',
      },
      created_at:{
        type:Sequelize.DATE,
        allowNull:false,
      },
      updated_at:{
        type:Sequelize.DATE,
        allowNull:false,
      }
    });
    
  },

  down: async (queryInterface, Sequelize) => {
  
    await queryInterface.dropTable('agendamentos');
    
  }
};
