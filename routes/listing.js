const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const listingsController = require("../controllers/listings");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// ======================
// ROUTES
// ======================

// INDEX + CREATE
router
  .route("/")
  .get(wrapAsync(listingsController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingsController.createListing)
  );

// NEW
router.get(
  "/new",
  isLoggedIn,
  listingsController.renderNewForm
);

// SHOW / UPDATE / DELETE
router
  .route("/:id")
  .get(wrapAsync(listingsController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingsController.updateListing)
  )
  .delete(
    isLoggedIn,
    isOwner,
    wrapAsync(listingsController.deleteListing)
  );

// EDIT
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingsController.renderEditForm)
);

module.exports = router;
