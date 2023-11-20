"use strict";

const { Op } = require("sequelize");

const permissions = [
  { name: "api.*" },
  { name: "view.*" },
  { name: "api.banner.get" },
  { name: "api.banner.create" },
  { name: "api.banner.patch" },
  { name: "api.banner.delete" },
  { name: "api.banner.execute" },
  { name: "api.font.post" },
  { name: "api.fonts.get" },
  { name: "api.font.delete" },
  { name: "api.font.get" },
  { name: "api.font.patch" },
  { name: "view.banner.edit" },
  { name: "view.banner.new" },
  { name: "view.banner.code" },
  { name: "view.fonts" },
];
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
    await queryInterface.bulkInsert("permission", permissions, {});

    await queryInterface.bulkInsert("user_type_permission", [
      {
        userTypeId: 2, // Añadir todos los permisos al Administrador
        permissionName: "api.*",
      },
      {
        userTypeId: 2,
        permissionName: "view.*",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("permission", {
      name: { [Op.in]: permissions.map((p) => p.name) },
    });

    await queryInterface.bulkDelete("user_type_permission", {
      userTypeId: 2, // Añadir todos los permisos al Administrador
      permissionName: { [Op.in]: ["api.*", "view.*"] },
    });
  },
};
