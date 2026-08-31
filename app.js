if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");

const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const Listing = require("./models/listing.js");

// ======================
// DATABASE CONNECTION
// ======================
const dbUrl = process.env.ATLASDB_URL;

mongoose
  .connect(dbUrl)
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

// ======================
// APP CONFIG
// ======================
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// ======================
// SESSION STORE
// ======================
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET || "mysupersecretkey",
  },
  touchAfter: 24 * 3600,
});

store.on("error", (e) => {
  console.log("SESSION STORE ERROR", e);
});

const sessionOptions = {
  store,
  name: "session",
  secret: process.env.SECRET || "mysupersecretkey",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
};

app.use(session(sessionOptions));
app.use(flash());

// ======================
// PASSPORT CONFIG
// ======================
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ======================
// LOCALS (FLASH + USER)
// ======================
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

// ======================
// SEARCH DROPDOWN DATA
// ======================
app.use(async (req, res, next) => {
  try {
    res.locals.countries = await Listing.distinct("country");
  } catch (err) {
    res.locals.countries = [];
  }
  next();
});

app.use((req, res, next) => {
  res.locals.selectedCountry = req.query.country || "";
  res.locals.selectedCategory = req.query.category || "";
  next();
});

// ======================
// ROUTES
// ======================
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// ======================
// 404 HANDLER
// ======================
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});


// ======================
// ERROR HANDLER
// ======================
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { err });
});

// ======================
// SERVER
// ======================
app.listen(8080, () => {
  console.log("server is listening on port 8080");
});
