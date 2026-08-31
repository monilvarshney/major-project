const express = require("express");
const router = express.Router();
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync");
const { saveRedirectTo } = require("../middleware");
const userController = require("../controllers/user");

// SIGNUP
router
  .route("/signup")
  .get(userController.rendersignupForm)
  .post(wrapAsync(userController.signupForm));

// LOGIN
router
  .route("/login")
  .get(userController.renderloginForm)
  .post(
    saveRedirectTo,
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    userController.login
  );

// LOGOUT
router.get("/logout", userController.logoutUser);

module.exports = router;
