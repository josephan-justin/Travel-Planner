const { User, Profile, sequelize } = require("../models");
const { signToken } = require("../helpers/jwt");

class Controller {
  static async register(req, res, next) {
    try {
      const {
        username,
        email,
        password,
        fullName,
        address,
        phone,
        birthDate,
        gender,
      } = req.body;

      if (!username || !email || !password)
        throw {
          name: "BadRequest",
        };
      

      const user = await sequelize.transaction(async (transaction) => {
        const user = await User.create(
          {
            username,
            email,
            password,
          },
          { transaction },
        );

        await Profile.create(
          {
            UserId: user.id,
            fullName,
            address,
            phone,
            birthDate,
            gender,
          },
          { transaction },
        );

        return user;
      });

      delete user.dataValues.password;
      delete user.dataValues.createdAt;
      delete user.dataValues.updatedAt;

      res.status(201).json({
        message: "Success create new user",
        user,
      });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email || !password) throw { name: "BadRequest" };

      const user = await User.findByEmail(email);
      if (!user || !user.checkPassword(password)) throw { name: "LoginError" };

      const payload = {
        id: user.id,
        email: user.email,
      };

      const access_token = signToken(payload);

      res.status(200).json({
        access_token,
      });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async googleLogin(req, res, next) {
    try {
      const { OAuth2Client } = require("google-auth-library");
      const client = new OAuth2Client();
      const { token } = req.headers;

      const ticket = await client.verifyIdToken({
        idToken: token,
        audience:
          "203823204239-tmvdqtmt3579uk5edg9hi415128oj9d7.apps.googleusercontent.com",
      });
      const gPayload = ticket.getPayload();
      const [user, created] = await User.findOrCreate({
        where: {
          email: gPayload.email,
        },
        defaults: {
          username: gPayload.email.split("@")[0],
          email: gPayload.email,
          password: "google_password",
        },
      });

      await Profile.findOrCreate({
        where: {
          UserId: user.id,
        },
        defaults: {
          fullName: gPayload.name,
        }
      });

      const payload = {
        id: user.id,
        email: user.email,
      };

      const access_token = signToken(payload);

      res.status(200).json({
        access_token,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = Controller;
