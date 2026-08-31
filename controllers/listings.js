const Listing = require("../models/listing");



module.exports.index =async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  }


module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
  } ;


module.exports.showListing = async (req, res) => {
    const listing = await Listing.findById(req.params.id)
      .populate({ path: "reviews" ,
          populate: { path: "author" }  ,       
          populate: { path: "author" }  ,       

      })
      .populate("owner");
     if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }         
    res.render("listings/show.ejs", { listing });
  } ;

module.exports.createListing = async (req, res) => {
  const newListing = new Listing(req.body.listing);

  newListing.owner = req.user._id; // set owner first

  // ONLY set image if file exists
  if (req.file) {
    const url = req.file.path;
    const filename = req.file.filename;
    newListing.image = { url, filename };
  }

  await newListing.save();

  req.flash("success", "Listing created successfully!");
  res.redirect("/listings");
};


module.exports.renderEditForm = async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url; // Store original image URL
    originalImageUrl = originalImageUrl.replace("/upload/", "/upload/h_300,w_300/"); // Modify URL for thumbnail
    res.render("listings/edit.ejs", { listing });
  }

module.exports.updateListing =async (req, res) => {

    
    let listing = await Listing.findByIdAndUpdate(req.params.id, {
      ...req.body.listing,
      
    });
    if(typeof req.file !== 'undefined'){  // ✅ CHECK IF FILE IS UPLOADED     

    let url = req.file.file.path;
    let filename = req.file.filename;      
    listing.image= {url, filename};  // ✅ SET IMAGE
    await listing.save();   
    }
    req.flash("success", "Listing updated successfully!"); 
    res.redirect(`/listings/${req.params.id}`);
  };

module.exports.deleteListing = async (req, res) => {
    let{ id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");
  };