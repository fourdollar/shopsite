"use strict";

module.exports = function(sequelize, DataTypes) {
  var Product = sequelize.define("product", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: DataTypes.STRING,
    num: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.INTEGER,
    created: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    timestamps: false,
    underscored: true,
    tableName: 'Product',
    charset: 'utf8mb4'
  });

  return Product;
};
