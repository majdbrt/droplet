const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user");
const { createAccessToken, createRefreshToken } = require("../utils/tokens");

router.post("/signup", async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        const user = await User.findOne({ email: email });

        if (user) {
            return res.status(403).json({
                type: "error",
                message: "User already exists"
            });
        }// if

        else {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);



            const newUser = new User({
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: hash
            });

            await newUser.save();


            const user = await User.findOne({ email: email });

            const accessToken = createAccessToken(user._id);
            const refreshToken = createRefreshToken(user._id);

            user.refreshToken = refreshToken;
            await user.save();

            return res.status(200).cookie("refreshToken", refreshToken, { httpOnly: true }).json({

                accessToken: accessToken,
                userID: user._id
            });
        }// else
    } catch (error) {
        res.status(500).json({
            type: "error",
            message: "Error creating user"
        });
    }// catch
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(403).json({
                type: "error",
                message: "User does not exist"
            });
        }// if
        else {
            const correctPassword = await bcrypt.compare(password, user.password);

            if (!correctPassword) {
                return res.status(403).json({
                    type: "error",
                    message: "Invalid password"
                });
            }// if
            else {
                const accessToken = createAccessToken(user._id);
                const refreshToken = createRefreshToken(user._id);

                user.refreshToken = refreshToken;
                await user.save();

                return res.status(200).cookie("refreshToken", refreshToken, { httpOnly: true }).json({

                    accessToken: accessToken,
                    userID: user._id
                });

            }// else

        }// else
    } catch (error) {
        res.status(500).json({
            type: "error",
            message: "Error loging in user"
        });
    }// catch
})

router.post("/logout", async (req, res) => {
    try {
        res.clearCookie("refreshToken").send();
    } catch (error) {
        res.status(500).json({
            type: "error",
            message: "Error loging out user"
        });
    }// catch
});

router.get("/token", async (req, res) => {
    try {
        const { refreshToken } = req.cookies;

        if (!refreshToken) {
            return res.status(403).json({
                type: "error",
                message: "No refresh token"
            });
        }// if

        const id = await jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET).id;

        const user = await User.findById(id);

        if (!id || !user) {
            return res.status(403).clearCookie("refreshToken", {
                httpOnly: true
            }).json({
                type: "error",
                message: "Invalid refresh token"
            });

        }// if

        if (user.refreshToken !== refreshToken) {
            return res.status(403).clearCookie("refreshToken", {
                httpOnly: true
            }).json({
                type: "error",
                message: "Invalid refresh token"
            });
        }// if

        const newAccessToken = createAccessToken(user._id);

        return res.status(200).json({
            accessToken: newAccessToken,

        });


    } catch (error) {
        res.status(500).json({
            type: "error",
            message: "Error refreshing token"
        })
    } // catch

})

module.exports = router;