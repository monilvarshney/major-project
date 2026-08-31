const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing");
const Review = require("../models/review");
const wrapAsync = require("../utils/wrapAsync");
const { validateListing, validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");
const listing = require("../models/listing.js");
const reviewController = require("../controllers/reviews");


// ======================
// REVIEWS
// ======================
router.post(
  "/",
  validateReview,
  wrapAsync(reviewController.createReview)
);


//delete review Route
router.delete(
    "/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.deleteReview)
);

module.exports = router; 