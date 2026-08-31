const User = require("../models/user");



module.exports.rendersignupForm =  (req, res) => {
  res.render("users/signup.ejs"); 
};

module.exports.renderloginForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.login = (req, res) => {
  req.flash("success", "Welcome back!");
  res.redirect(res.locals.redirectUrl || "/listings");
};


module.exports.logoutUser = (req, res) => {
  req.logout((err) => {
    if (err) { return next(err); }  
    req.flash("success", "Logged you out!");
    res.redirect("/listings");
    })};

module.exports.signupForm = async (req, res) => {
  try {
    const { username, email, password } = req.body; 
    const user = new User({ username, email });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
        req.flash("success", "Welcome to Wanderlust!");
        res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("signup");
  }};