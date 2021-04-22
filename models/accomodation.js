'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Accomodation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Accomodation.init({
    name: DataTypes.STRING,
    starRating: DataTypes.STRING,
    address: DataTypes.STRING,
    guestRating: DataTypes.STRING,
    scale: DataTypes.STRING,
    currentPrice: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Accomodation',
  });
  return Accomodation;
};