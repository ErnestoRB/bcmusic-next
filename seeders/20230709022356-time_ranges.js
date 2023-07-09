"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert(
      "time_ranges",
      [
        { id: 1, nombre: "short_term" },
        { id: 2, nombre: "medium_term" },
        { id: 3, nombre: "long_term" },
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
      "users",
      {
        id: {
          [Sequelize.Op.between]: [1, 3],
        },
      },
      {}
    );
  },
};
