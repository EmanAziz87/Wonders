const User = require("../models/user");

module.exports.renderRegisterForm = (req, res) => {
  res.render("users/register");
};

module.exports.submitRegistration = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.registerUser(username, password, email);
    req.login(user, (err) => {
      if (err) return next(err);
      req.flash("success", "Successfully Registered!");
      res.redirect("/attractions");
    });
  } catch (err) {
    const errorMessageArray = err.errors[0].message.split(" ");
    const capitalizeMessage = errorMessageArray
      .map((string) => {
        const charSplit = string.split("");
        charSplit[0] = charSplit[0].toUpperCase();
        return charSplit.join("");
      })
      .join(" ");
    req.flash("error", capitalizeMessage);
    res.redirect("/register");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login");
};

module.exports.submitLogin = (req, res) => {
  req.flash("success", "Welcome Back!");
  const redirectUrl = res.locals.returnTo || "/attractions";
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
  req.logOut(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Goodbye!");
    res.redirect("/attractions");
  });
};
