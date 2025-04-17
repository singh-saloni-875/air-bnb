const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  image: {
   
      type: String,
       default: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      set: (v) => {
        // Only apply the default if the value is undefined or empty
        if (!v || v.trim() === "") {
          return "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60";
        }
        return v; // Otherwise, use the provided value
      },
    
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
    type: Schema.Types.ObjectId,
    ref:"review",
    },
  ],
});

listingSchema.post("findOneAndDelete", async(listing) =>{
  if(listing){
    await Review.deleteMany({_id :{$in : listing.reviews}});
  }
  
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;



