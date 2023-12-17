const LocalStrategy = require("passport-local");
const User = require("../models/user");
const bcrypt = require("bcrypt");

const verifyCallback = (username, password, cb) => {
  User.findOne({ where: { username: username } })
    .then(async (user) => {
      if (!user) {
        return cb(null, false, { message: "Incorrect username or password." });
      }

      const validPass = await bcrypt.compare(password, user.password);
      if (!validPass) {
        return cb(null, false, { message: "Incorrect username or password." });
      }
      return cb(null, user);
    })
    .catch((err) => {
      cb(err);
    });
};

const strategy = new LocalStrategy(verifyCallback);

module.exports = strategy;
