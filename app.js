if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("./utils/passport");
const User = require("./models/user");

const ExpressError = require("./utils/ExpressError");
const attractionRoutes = require("./routes/attractions");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require("./routes/users");

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(flash());

const sessionConfig = {
  secret: "a secret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));

app.use(passport.initialize());
app.use(passport.session());
passport.use(localStrategy);

passport.serializeUser(function (user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function (userId, cb) {
  User.findByPk(userId)
    .then((user) => {
      cb(null, user);
    })
    .catch((err) => {
      cb(err);
    });
});

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/attractions", attractionRoutes);
app.use("/attractions/:id/reviews", reviewRoutes);
app.use("/", userRoutes);

app.get("/", (req, res) => {
  res.render("home");
  const { id } = req.params;
});

app.all("*", (req, res, next) => {
  next(new ExpressError("Page not found!", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh no, something went wrong!";
  res.status(statusCode).render("error", { err });
});

app.listen(3000, (req, res) => {
  console.log("SERVING ON PORT 3000");
});
