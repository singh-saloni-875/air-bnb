const express = require("express");
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/post.js");
const session = require("express-session");
const flash = require("connect-flash");
const Path= require("path");

// can add more option here
const sessionOption = {
    secret: "mysuperscrectstring", 
    resave: false, 
    saveUninitialized: true
};

app.set("view engine", "ejs");
app.set("views", Path.join(__dirname,"views"));
app.use(session(sessionOption));
app.use(flash());

// register route
app.get("/register",(req,res)=>{
    let {name= "anonymous"} = req.query;
    req.session.name = name;
    req.flash("success", "user registered successful");
    res.redirect("/hello");
});

app.get("/hello", (req, res) =>{
    res.locals.messages = req.flash("success");
    res.render("page.ejs",{name: req.session.name});
});

// app.get("/test",(req, res)=>{
//     res.send("test successfull!");
// });

// app.get("/reqcount", (req, res) => {
//     if(req.session.count){
//         req.session.count++;
//     }else{
//         req.session.count = 1;
//     }
//     res.send(`you send a request ${req.session.count} time`);
// });



app.listen(3000, () => {
    console.log("server is listening on port 3000");
});