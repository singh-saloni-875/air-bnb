const express = require("express");
const router = express.Router({mergeParams: true});
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");

const validateReview = (req, res, next)=>{
    let{error}=reviewSchema.validate(req.body);
    
    if(error){
        let errorMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400, errorMsg);
    }else{
        next();
    }
};
// review route(POST ROUTE)
router.post("/",validateReview,wrapAsync( async(req,res) =>{
    console.log(req.params.id); 
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview._id);

    await newReview.save();
    await listing.save();
    console.log("new review save");
    req.flash("success", "new review added");
    res.redirect(`/listing/${req.params.id}`);
   
}));

// reveiw delete route(post route)
router.delete("/:reviewId",wrapAsync(async(req,res)=>{
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "new review added");
    res.redirect(`/listing/${id}`);
    
}));

module.exports = router;