'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
   
    await queryInterface.createTable('disponibilidades',
    {
      id:{
        type:Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      date:{
        type:Sequelize.DATE,
        allowNull: false,
        unique: true
      },
      hour:{
        type:Sequelize.INTEGER,
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
    
    await queryInterface.dropTable('disponibilidades');
     
  }
};
