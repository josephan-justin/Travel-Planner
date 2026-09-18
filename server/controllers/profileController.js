const { Profile, User } = require("../models");

class Controller {
  static async getProfile(req, res, next) {
    try {
      console.log("LOGIN INFO:", req.loginInfo);
      console.log("USER ID:", req.loginInfo.userId);
      const { userId } = req.loginInfo;
      const profile = await Profile.findOne({
        where: {
          UserId: userId,
        },
      });

      if (!profile)
        throw {
          name: "NotFound",
        };

      res.status(200).json({
        message: "Success read profile",
        profile,
      });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async updateProfile(req, res, next) {
    try {
      console.log("UPDATE PROFILE HIT");

      const { userId } = req.loginInfo;
      const { fullName, address, phone, birthDate, gender } = req.body;

      const profile = await Profile.findOne({
        where: {
          UserId: userId,
        },
      });

      console.log("PROFILE:", profile);

      if (!profile) {
        throw { name: "NotFound" };
      }

      await profile.update({
        fullName,
        address,
        phone,
        birthDate,
        gender,
      });

      res.status(200).json({
        message: "Profile updated successfully",
        profile,
      });
    } catch (err) {
      console.log(JSON.stringify(err, null, 2));
      next(err);
    }
  }
}

module.exports = Controller;
