"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("general_settings", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      value: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      desc: {
        type: Sequelize.TEXT,
      },
      active: {
        type: Sequelize.BOOLEAN,
        default: 1,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("general_settings");
  },
};
