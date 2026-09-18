"use strict";
const bcrypt = require("bcryptjs");

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    checkPassword(password) {
      return bcrypt.compareSync(password, this.password);
    }

    static findByEmail(email) {
      return User.findOne({
        where: {
          email,
        },
      });
    }

    static associate(models) {
      User.hasOne(models.Profile, {
        foreignKey: "UserId",
      });

      User.hasMany(models.TravelPlan, {
        foreignKey: "UserId",
      });
    }
  }
  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Username Required!",
          },
          notEmpty: {
            msg: "Username Required!",
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Email Required!",
          },
          notEmpty: {
            msg: "Email Required!",
          },
          isEmail: {
            msg: "Invalid Email Format!",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          len: {
            args: [8],
            msg: "Password must be at least 8 characters!",
          },
        },
      },
      googleId: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: "User",
      hooks: {
        beforeCreate(user) {
          if(user.password){
            const salt = bcrypt.genSaltSync(10);
            user.password = bcrypt.hashSync(user.password, salt);
          }
        },
      },
    },
  );
  return User;
};
