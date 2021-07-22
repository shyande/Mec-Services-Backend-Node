'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

      await queryInterface.createTable('empresas', 
        {
         id:{
           type:Sequelize.INTEGER,
           allowNull: false,
           autoIncrement: true,
           primaryKey: true,
         },
         email:{
           type:Sequelize.STRING,
           allowNull:false,
           unique:true,
         },
         cnpj:{
           type:Sequelize.STRING,
           allowNull:false,
           unique:true,
         },
         name:{
           type:Sequelize.STRING,
           allowNull:false,
         },
         telefone:{
           type:Sequelize.STRING,
           allowNull: false,
         },
         endereco:{
          type:Sequelize.STRING,
          allowNull: false,
          unique:true,
        },
         password_hash:{
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
  
    await queryInterface.dropTable('empresas');
    
  }
};
