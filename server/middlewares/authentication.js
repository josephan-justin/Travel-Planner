const { User } = require("../models");
const { verifyToken } = require("../helpers/jwt");

async function authentication(req, res, next) {
  try {
    const { authorization } = req.headers;
    let access_token;

    if (authorization) {
      access_token = authorization.split(" ")[1];
    } else if (req.query.access_token) {
      access_token = req.query.access_token;
    } else {
      throw { name: "Unauthorized" };
    }

    const payload = verifyToken(access_token);

    const user = await User.findByPk(payload.id);

    if (!user) {
      throw { name: "Unauthorized" };
    }

    req.loginInfo = {
      userId: user.id,
      email: user.email,
    };

    next();
  } catch (err) {
    next(err);
  }
}

module.exports = authentication
