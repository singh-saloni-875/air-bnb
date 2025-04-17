const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/airbnb");
}
main().then(()=>{
    console.log("connected to db");
}).catch((err)=>{
    console.log(err);
});

// a function to init database
const initDB = async ()=>{
    await Listing.deleteMany({}); // delete if any data we already insert
    await Listing.insertMany(initData.data); //insert data and access data key
    console.log("data was initialized");
}
initDB(); 

