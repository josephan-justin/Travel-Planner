"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TravelPlan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      TravelPlan.belongsTo(models.User, {
        foreignKey: "UserId",
      });
      TravelPlan.hasMany(models.Itinerary, {
        foreignKey: "TravelPlanId",
      });
    }
  }
  TravelPlan.init(
    {
      UserId: DataTypes.INTEGER,
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Title Required!",
          },
          notEmpty: {
            msg: "Title Required!",
          },
        },
      },
      destination: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Destination Required!",
          },
          notEmpty: {
            msg: "Destination Required!",
          },
        },
      },
      duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Duration Required!",
          },
          notEmpty: {
            msg: "Duration Required!",
          },
        },
      },
      budget: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Budget Required!",
          },
          notEmpty: {
            msg: "Budget Required!",
          },
        },
      },
      travelStyle: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Travel Style Required!",
          },
          notEmpty: {
            msg: "Travel Style Required!",
          },
        },
      },
      language: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "en",
        validate: {
          isIn: {
            args: [["id", "en"]],
            msg: "Language must be id or en!",
          },
        },
      },
      budgetBreakdown: {
        type: DataTypes.JSONB,
        allowNull: true,
      },

      travelTips: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "TravelPlan",
    },
  );
  return TravelPlan;
};
