const Joi = require("joi");

module.exports.attractionSchema = Joi.object({
  title: Joi.string().required(),
  location: Joi.string().required(),
  price: Joi.number().required().min(0),
  description: Joi.string().required(),
});

module.exports.imageDeleteSchema = Joi.string();

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required(),
    body: Joi.string().max(1000).required(),
  }).required(),
});
