'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transporte extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Transporte.init({
    minPrice: DataTypes.STRING,
    direct: DataTypes.BOOLEAN,
    departure: DataTypes.STRING,
    airline: DataTypes.STRING,
    landmarkOrigin: DataTypes.STRING,
    landmarkDestination: DataTypes.STRING,
    countryOrigin: DataTypes.STRING,
    countryDestination: DataTypes.STRING,
    cityOrigin: DataTypes.STRING,
    cityDestination: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Transporte',
  });
  return Transporte;
};