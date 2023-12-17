const Attractions = require("../models/attraction");
const Reviews = require("../models/review");
const Users = require("../models/user");
const Images = require("../models/images");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require("../cloudinary/index");

module.exports.index = async (req, res) => {
  const attractions = await Attractions.findAll();
  const images = await Images.findAll();
  const uniqueImages = [images[0]];
  const hashMap = new Map();
  if (images.length) {
    hashMap.set(images[0].attractionId);
    for (let img of images) {
      if (!hashMap.has(img.attractionId)) {
        uniqueImages.push(img);
        hashMap.set(img.attractionId);
      }
    }
  }
  res.render("attractions/index", { attractions, uniqueImages });
};

module.exports.renderNewForm = (req, res) => {
  res.render("attractions/new");
};

module.exports.submitNewAttraction = async (req, res, next) => {
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.attraction.location,
      limit: 1,
    })
    .send();
  const attractionObject = {
    ...req.body.attraction,
    geometry: {
      type: "Point",
      coordinates: geoData.body.features[0].geometry.coordinates,
    },
  };
  await Attractions.create(attractionObject);
  const newAttraction = await Attractions.findOne({
    where: {
      title: req.body.attraction.title,
      location: req.body.attraction.location,
    },
  });

  const imageInfo = req.files.map((f) => {
    const urlArr = f.path.split("/");
    for (let i = 0; i < urlArr.length; i++) {
      if (urlArr[i] === "upload") {
        urlArr[i] = "upload/c_fill,w_400,h_400";
      }
    }
    const url = urlArr.join("/");

    return {
      path: f.path,
      filename: f.filename,
      thumbnailPath: url,
    };
  });

  for (let info of imageInfo) {
    const newImage = await Images.create(info);
    newAttraction.addImage(newImage);
  }

  const currentUser = await Users.findOne({ where: { id: req.user.id } });
  await currentUser.addAttraction(newAttraction);
  req.flash("success", "Successfully made a new attraction!");
  res.redirect(`/attractions/${newAttraction.id}`);
};

module.exports.showAttraction = async (req, res) => {
  const { id } = req.params;
  const foundAttraction = await Attractions.findByPk(req.params.id);
  if (!foundAttraction) {
    req.flash("error", "Cannot find that attraction :(");
    res.redirect("/attractions");
  }
  const associatedUser = await Users.findByPk(foundAttraction.userId);
  const reviews = await Reviews.findAll({ where: { attractionId: id } });
  const users = await Users.findAll();
  const images = await Images.findAll({ where: { attractionId: id } });
  res.render("attractions/show", {
    foundAttraction,
    reviews,
    users,
    associatedUser,
    images
  });
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const attraction = await Attractions.findByPk(id);
  const images = await Images.findAll({ where: { attractionId: id } });

  if (!attraction) {
    req.flash("error", "Cannot find that campground :(");
    res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", { attraction, images });
};

module.exports.submitEditForm = async (req, res) => {
  const { id } = req.params;
  await Attractions.update(req.body.attraction, {
    where: { id: id },
  });
  const newAttraction = await Attractions.findOne({
    where: {
      title: req.body.attraction.title,
      location: req.body.attraction.location,
    },
  });
  const attractionImages = await Images.findAll({
    where: { attractionId: id },
  });

  const imageInfo = req.files.map((f) => {
    const urlArr = f.path.split("/");
    for (let i = 0; i < urlArr.length; i++) {
      if (urlArr[i] === "upload") {
        urlArr[i] = "upload/c_fill,w_400,h_400";
      }
    }
    const url = urlArr.join("/");

    return {
      path: f.path,
      filename: f.filename,
      thumbnailPath: url,
    };
  });

  for (let info of imageInfo) {
    const newImage = await Images.create(info);
    newAttraction.addImage(newImage);
  }
  const imagesToDelete = req.body.deleteImages;

  if (
    attractionImages &&
    imagesToDelete &&
    attractionImages.length - imagesToDelete.length >= 1
  ) {
    for (let filename of imagesToDelete) {
      await cloudinary.uploader.destroy(filename);
      await Images.destroy({ where: { filename: filename } });
    }
    req.flash("success", "Successfully updated attraction!");
    res.redirect(`/attractions/${req.params.id}`);
  } else if (
    attractionImages &&
    imagesToDelete &&
    attractionImages.length - imagesToDelete.length === 0
  ) {
    req.flash("error", "There has to be atleast one image on a post");
    res.redirect(`/attractions/${req.params.id}`);
  } else {
    req.flash("success", "Successfully updated attraction!");
    res.redirect(`/attractions/${req.params.id}`);
  }
};

module.exports.deleteAttraction = async (req, res) => {
  const { id } = req.params;
  await Attractions.destroy({ where: { id: id } });
  req.flash("success", "Attraction Deleted");
  res.redirect("/attractions");
};
