'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Itinerary extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Itinerary.belongsTo(models.TravelPlan, {
        foreignKey: 'TravelPlanId'
      })
    }
  }
  Itinerary.init({
    TravelPlanId: DataTypes.INTEGER,
    day: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Day Required!'
        },
        notEmpty:{
          msg: 'Day Required!'
        }
      }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Title Required!'
        },
        notEmpty:{
          msg: 'Title Required!'
        }
      }
    },
    activities: {
      type: DataTypes.JSONB,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Itinerary',
  });
  return Itinerary;
};