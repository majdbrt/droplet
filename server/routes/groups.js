const express = require("express");
const authenticate = require("../utils/authenticate");
const router = express.Router();
const { User } = require("../models/user");
const { Group } = require("../models/group")

router.post("", authenticate, async (req, res) => {
    try {
        if (req.user) {
            const { contactEmail } = req.body;

            const contactUser = await User.findOne({
                email: contactEmail
            });

            if (!contactUser || contactEmail === req.user.email) {
                return res.status(401).json({
                    type: "error",
                    message: "User not found"
                });
            }// if

            const participents = [req.user, contactUser];

            const group = await Group.findOne({
                participents: { "$all": participents }
            });

            if (group) {
                const groupPreview = {
                    _id: group._id,
                    participents: group.participents
                }
                return res.status(401).json({
                    type: "error",
                    message: "Group already exists",
                    group: groupPreview
                });
            };

            const newGroup = new Group({
                participents: participents
            });



            newGroup.save();

            const groupPreview = {
                _id: newGroup._id,
                participents: newGroup.participents
            }

            
            return res.status(200).json({
                group: groupPreview
            });
        }// if

        else {
            return res.status(404).json({
                type: "error",
                message: "Page not found"
            });
        }// else
    } catch (error) {
        res.status(500).json({
            type: "error",
            message: "Error retrieving data"
        });
    }// catch
});

router.get("", authenticate, async (req, res) => {
    try {
        if (req.user) {
            const groups = await Group.find({
                participents: { "$in": req.user }
            }).populate(
                {
                    path: "participents",
                    select: "firstName lastName email isActive",
                    match: { _id: { "$ne": req.user._id } }
                }
            ).select("participents createdAt updatedAt");
            if (groups) {

                return res.status(200).json({ groups });
            }
        }// if
    } catch (error) {

        res.status(500).json({
            type: "error",
            message: "Error retrieving data"
        });
    }// catch
});

router.delete("/:id", authenticate, async (req, res) => {
    try {
        if(req.user){
           const groupID = req.params.id;
           await Group.deleteOne({_id: groupID});
           return res.status(200).json({
            type:"success",
            message:"Group deleted successfully"
           });

        }// if
    } catch (error) {
        res.status(500).json({
            type: "error",
            message: "Error retrieving data"
        });
    }// catch
});

module.exports = router;

