'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Personas extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Personas.init({
    admin: DataTypes.BOOLEAN,
    email: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    savedPacks: DataTypes.STRING,
    puntuation: DataTypes.FLOAT,
    profileimage: DataTypes.STRING,
    lastSeen: DataTypes.DATE,
    comments: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Personas',
  });
  return Personas;
};