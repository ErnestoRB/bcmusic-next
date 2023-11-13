"use strict";
const { Op } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     */
    await queryInterface.bulkInsert(
      "user_type",
      [
        { id: 1, name: "Default" },
        { id: 2, name: "Admin" },
        { id: 3, name: "Colab" },
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
      "user_type",
      {
        id: {
          [Op.between]: [1, 3],
        },
      },
      {}
    );
  },
};
