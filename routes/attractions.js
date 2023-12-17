const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const attractions = require("../controllers/attractions");
const {
  isLoggedIn,
  validateAttraction,
  isAuthor,
  validateDeletedImages,
} = require("../middleware");
const { storage } = require("../cloudinary");
const multer = require("multer");
const upload = multer({ storage });

router
  .route("/")
  .get(catchAsync(attractions.index))
  .post(
    isLoggedIn,
    upload.array("image"),
    validateAttraction,
    catchAsync(attractions.submitNewAttraction)
  );

router.get("/new", isLoggedIn, attractions.renderNewForm);

router
  .route("/:id")
  .get(catchAsync(attractions.showAttraction))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    validateAttraction,
    validateDeletedImages,
    catchAsync(attractions.submitEditForm)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(attractions.deleteAttraction));

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(attractions.renderEditForm)
);

module.exports = router;
