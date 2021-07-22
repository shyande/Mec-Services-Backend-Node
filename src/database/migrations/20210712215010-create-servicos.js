'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('servicos',
    {
      id:{
        type:Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      tipo_servico:{
        type:Sequelize.STRING,
        allowNull: false,
        unique:true,
        
      },
      tempo_estimado:{
        type:Sequelize.STRING,
        allowNull: false,
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
  
    await queryInterface.dropTable('servicos');
     
  }
};
