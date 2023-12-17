const db = require("../utils/database");
const Sequelize = require("sequelize");
const bcrypt = require("bcrypt");
const Attractions = require("./attraction");
const Review = require("./review");

const User = db.define("user", {
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

User.hasMany(Attractions, {
  onDelete: "CASCADE",
});
Attractions.belongsTo(User);

User.hasMany(Review, {
  onDelete: "CASCADE",
});
Review.belongsTo(User);

User.registerUser = async function (username, password, email) {
  const hash = await bcrypt.hash(password, 12);
  const user = await User.create({ email, username, password: hash });
  return user;
};

User.findAndValidate = async function (username, password) {
  const user = await User.findOne({ where: { username } });
  const matchValid = await bcrypt.compare(password, user.password);
  return matchValid;
};

module.exports = User;
