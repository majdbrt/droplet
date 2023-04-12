const express = require("express");
const router = express.Router();
const authenticate = require("../utils/authenticate");
const { route } = require("./auth");

router.get("/", authenticate, async (req, res) => {
    try{
        if(req.user){
            return res.status(200).json({
                user: req.user,
                authenticated: true
            });
        }// if

    } catch (error){
        res.status(500).json({
            type:"error",
            message:"Error retrieving data"
        })
    }
})

module.exports = router;
