const Attractions = require("../models/attraction");
const Reviews = require("../models/review");
const Users = require("../models/user");

module.exports.submitReview = async (req, res) => {
  const { id } = req.params;
  const review = await Reviews.create(req.body.review);
  const attraction = await Attractions.findByPk(id);
  const currentUser = await Users.findByPk(req.user.id);
  await attraction.addReview(review);
  await currentUser.addReview(review);
  req.flash("success", "Created new review");
  res.redirect(`/attractions/${id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { reviewId, id } = req.params;
  await Reviews.destroy({ where: { id: reviewId } });
  req.flash("success", "Deleted your review");
  res.redirect(`/attractions/${id}`);
};
