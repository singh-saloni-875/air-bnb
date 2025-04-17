const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Path= require("path");
const methodOverride = require("method-override");
const ejsMate= require('ejs-mate');
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");

const listing = require("./routes/listing.js");
const reviews = require("./routes/review.js");

app.set("view engine", "ejs");
app.set("views", Path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static('public'));

const sessionOption = {
    secret: "mysecreatcode",
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    },
};



async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/airbnb");
}
main().then(()=>{
    console.log("connected to db");
}).catch((err)=>{
    console.log(err);
});

app.get("/",(req,res)=>{
    res.send("yes it working");
}); 

app.use(session(sessionOption));
app.use(flash());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    next();
});

app.use("/listing", listing);
app.use("/listing/:id/review", reviews);

//  error handler middleware
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found!"));
});
app.use((err,req, res, next) =>{
   let{statusCode= 500,message="something went wrong!"} = err;
   res.status(statusCode).render("error.ejs",{message});
//    res.status(statusCode).send(message);
});
app.listen(8080, ()=>{
    console.log("server is listening to 8080");
});