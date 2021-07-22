'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
   
    await queryInterface.createTable('veiculos', { 
      id:{ 
        type:Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true,
      },
      placa:{
        type:Sequelize.STRING,
        allowNull:false,
        unique:true,
      },
      user:{
        type:Sequelize.INTEGER,
        references:{model:'users', key:'id'},
        onUpdate:'CASCADE',
        onDELETE:'SET NULL',
        allowNull:true,
      },
      modelo:{
        type:Sequelize.STRING,
        allowNull:false,
      },
      marca:{
        type:Sequelize.STRING,
        allowNull:false,
      },
      ano:{
        type:Sequelize.INTEGER,
        allowNull:false,
      },
      motor:{
        type:Sequelize.STRING,
        allowNull:false,
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
    
    await queryInterface.dropTable('veiculos');
    
  }
};
