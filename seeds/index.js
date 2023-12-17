const database = require("../utils/database");
const Attractions = require("../models/attraction");
const Review = require("../models/review");
const User = require("../models/user");
const Image = require("../models/images");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");

const sample = (array) => array[Math.floor(Math.random() * array.length)];

database.sync({ alter: true }).then(async () => {
  const user = await User.create({
    email: "tim@gmail.com",
    username: "tim",
    password: "tim",
  });

  for (let i = 0; i < 200; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const attraction = await Attractions.create({
      title: `${sample(descriptors)}, ${sample(places)}`,
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      price,
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis debitis libero itaque, voluptate nulla laudantium dolor numquam? Odit quis officia, doloremque sapiente quidem quia? Quidem quae commodi rerum laboriosam iusto?",
    });
    const img = await Image.create({
      path: "https://res.cloudinary.com/dbrvppje5/image/upload/v1702396926/YelpCamp/szufkkuqiuuxyepjwvw4.jpg",
      filename: "YelpCamp/szufkkuqiuuxyepjwvw4",
      thumbnailPath:
        "https://res.cloudinary.com/dbrvppje5/image/upload/w_200,h_200/v1702396926/YelpCamp/szufkkuqiuuxyepjwvw4.jpg",
    });
    await user.addAttraction(attraction);
    await attraction.addImage(img);
  }
  // await Review.create({ body: "body", rating: 2 });
});
