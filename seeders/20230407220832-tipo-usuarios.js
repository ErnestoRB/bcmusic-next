"use strict";
const { Op } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     */
    await queryInterface.bulkInsert(
      "tipo_usuario",
      [
        { id: 1, nombre: "default" },
        { id: 2, nombre: "admin" },
        { id: 3, nombre: "colab" },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete(
      "tipo_usuario",
      {
        id: {
          [Op.between]: [1, 3],
        },
      },
      {}
    );
  },
};
