const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");


const validateListing =(req, res, next)=>{
    let{error}=listingSchema.validate(req.body);
    
    if(error){
        let errorMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400, errorMsg);
    }else{
        next();
    }
};

// index route
router.get("/",async (req,res,next) =>{
    try{
        const allListing = await Listing.find({});
    res.render("listings/index.ejs", { allListing });
    }catch(err){
        next(err);
    }    
});

// Add new listing route
router.get("/new", (req,res) =>{
    res.render("listings/new.ejs");
});

// shows route
router.get("/:id", async (req,res,next)=>{
    try{
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/shows.ejs",{listing});   
    }catch(err){
        next(err);
    }
      
});


// create route (POST request)
router.post("/", validateListing, wrapAsync(async (req, res, next) => {
    
    const newListing = req.body.listing;
    const newlisting = new Listing(newListing);
    await newlisting.save();
    console.log(req.body.listing); // Log the newListing object
    req.flash("success", "New Listing Created!");
    res.redirect("/listing");
  }));
  

// edit route
router.get("/:id/edit", wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listing");
    }

    console.log("Listing Data:", listing);
    res.render("listings/edit.ejs", { listing });
}));

// update route (PUT request)
router.put("/:id", validateListing, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const { listing } = req.body;
     // Retain the existing image if the new image is empty
     if (!listing.image || listing.image.trim() === "") {
        const existingListing = await Listing.findById(id);
        listing.image = existingListing.image; // Keep the current image
    }

    await Listing.findByIdAndUpdate(id, { ...listing });
    req.flash("success", "listing updated");
    res.redirect(`/listing/${id}`);
}));

// delete route
router.delete("/:id",async(req,res)=>{
    try{
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "listing deleted");
    console.log("we deleted",deletedListing);
    res.redirect("/listing");
    }catch(err){
        next(err);
    }
    
});


module.exports = router;
