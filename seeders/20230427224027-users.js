"use strict";

const { Op } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("users", [
      {
        id: "973d26af-d69d-468b-8b54-7280614fb74d",
        name: "Ernesto",
        email: "dev.ernestorb@gmail.com",
        emailVerified: null,
        image: null,
        password:
          "$2b$10$CTuHSxt9Q5tsIIPAMFWfnuPjBYV74E4tF2LsAu8c4fsKeBVq/.T6S",
        birth: "2002-05-23 00:00:00",
        lastName: "Ramírez",
        countryId: 146,
        createdAt: "2023-04-27 21:59:55",
        updatedAt: "2023-04-27 21:59:55",
        userTypeId: 1,
      },

      {
        id: "bc1b0df7-ef43-4343-8ae1-2451c825b549",
        name: "Rodrigo",
        email: "rbernesto@outlook.com",
        emailVerified: null,
        image: null,
        password:
          "$2b$10$xn4EM0dQs2ZCJHEATR4pQOqF4h7fXmqgGCfayxci0HYpH/zlhWAJK",
        birth: "2002-05-23 00:00:00",
        lastName: "Ramírez",
        countryId: 146,
        createdAt: "2023-04-27 21:59:55",
        updatedAt: "2023-04-27 21:59:55",
        userTypeId: 2,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      "users",
      {
        id: {
          [Op.in]: [
            "bc1b0df7-ef43-4343-8ae1-2451c825b549",
            "973d26af-d69d-468b-8b54-7280614fb74d",
          ],
        },
      },
      {}
    );
  },
};
