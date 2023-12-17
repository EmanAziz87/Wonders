const db = require("../utils/database");
const Sequelize = require("sequelize");

const Review = db.define("review", {
  body: {
    type: Sequelize.STRING(1000),
    allowNull: false,
  },
  rating: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

module.exports = Review;
