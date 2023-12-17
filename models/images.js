const database = require("../utils/database");
const Sequelize = require("sequelize");
const Attractions = require("./attraction");

const Images = database.define("image", {
  path: {
    type: Sequelize.STRING(1000),
    allowNull: false,
  },
  filename: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  thumbnailPath: {
    type: Sequelize.STRING(1000),
    allowNull: false,
  },
});

Attractions.hasMany(Images, {
  onDelete: "CASCADE",
});
Images.belongsTo(Attractions);

module.exports = Images;
