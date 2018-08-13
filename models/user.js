"use strict";

module.exports = function(sequelize, DataTypes) {
  var user = sequelize.define("user", {
    id:{type: DataTypes.INTEGER, primaryKey: true,autoIncrement: true},
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    lastname: DataTypes.STRING,
    firstname: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    address1: DataTypes.STRING,
    address2: DataTypes.STRING,
    city: DataTypes.STRING,
    postal_code: DataTypes.STRING,
    state: DataTypes.STRING,
    created: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
          timestamps: false,
          underscored: true,
          tableName: 'user',
          charset: 'utf8mb4'
      });

  return user;
};
