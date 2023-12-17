const Sequelize = require("sequelize");

const db = new Sequelize("yelpcamp", "postgres", "myPassword", {
  dialect: "postgres",
  host: "localhost",
});

(async function authenticate() {
  try {
    await db.authenticate();
    console.log("CONNECTED TO YELP CAMP DB");
  } catch (err) {
    console.error("FAILED TO CONNECT TO YELP CAMP DB: ", err);
  }
})();

module.exports = db;
