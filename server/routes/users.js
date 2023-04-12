const express = require("express");
const router = express.Router();
const authenticate = require("../utils/authenticate");
const { User } = require("../models/user");

router.get("/:id", authenticate, async (req, res) => {
    try {
        
        if (req.user && req.params.id === req.user._id.toHexString()) {            
            return res.status(200).json({
                userID: req.user._id,
                email: req.user.email
            });
        }// if
        else{
            return res.status(404).json({
                type: "error",
                message:"Page not found"
            })
        }
    } catch (error) {
        res.status(500).json({
            type:"error",
            message:"Error retrieving data"
        });
    }// catch
});

module.exports = router;