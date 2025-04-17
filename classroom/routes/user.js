const express =require("express");
const router = express.Router();


// index route - users
router.get("/", (req,res)=>{
    res.send("Get for users");
});

// shows route - users
router.get("/:id", (req,res)=>{
    res.send("Get for show users");
});

// POST route - users
router.post("/", (req,res)=>{
    res.send("post for users");
});

// delete route - users
router.delete("/:id", (req,res)=>{
    res.send("Delete for users");
});
 
module.exports = router;