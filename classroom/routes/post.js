const express =require("express");
const router = express.Router();

// index route 
router.get("/", (req,res)=>{
    
    res.send("Get for posts");
});

// shows route 
router.get("/:id", (req,res)=>{
    res.send("Get for show posts id ");
});

// POST route 
router.post("/", (req,res)=>{
    res.send("post for posts");
});

// delete route 
router.delete("/:id", (req,res)=>{
    res.send("Delete for posts is");
});

module.exports = router;
