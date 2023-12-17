const database = require("../utils/database");
const Sequelize = require("sequelize");
const Review = require("./review");

const Attraction = database.define("attraction", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  geometry: {
    type: Sequelize.JSON,
    allowNull: false,
  },
  location: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  price: {
    type: Sequelize.FLOAT,
    allowNull: false,
    validate: {
      isNumeric: true,
    },
  },
  description: {
    type: Sequelize.STRING(1000),
    allowNull: false,
  },
});

Attraction.hasMany(Review, {
  onDelete: "CASCADE",
});
Review.belongsTo(Attraction);

module.exports = Attraction;
