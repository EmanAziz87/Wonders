const { attractionSchema } = require("./schemas");
const ExpressError = require("./utils/ExpressError");
const { reviewSchema } = require("./schemas");
const { imageDeleteSchema } = require("./schemas");
const Attractions = require("./models/attraction");
const Reviews = require("./models/review");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You Must Be Logged In");
    return res.redirect("/login");
  }
  next();
};

module.exports.storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
};

module.exports.validateAttraction = (req, res, next) => {
  const { error } = attractionSchema.validate(req.body.attraction);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateDeletedImages = (req, res, next) => {
  if (req.body.deleteImages) {
    const { error } = imageDeleteSchema.validate(req.body.deleteImages[0]);
    if (error) {
      const msg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(msg, 400);
    } else {
      next();
    }
  } else {
    next();
  }
};

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const attraction = await Attractions.findByPk(id);
  if (req.user.id !== attraction.userId) {
    req.flash("error", "You do not have permission to do that!");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { reviewId, id } = req.params;
  const review = await Reviews.findByPk(reviewId);
  if (req.user.id !== review.userId) {
    req.flash("error", "You do not have permission to do that!");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
