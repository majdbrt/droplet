const { User } = require("../models/user");
const jwt = require("jsonwebtoken");

async function authenticate(req, res, next) {

    try {
        const { authorization } = req.headers;

        if (!authorization) {
            return res.status(403).json({
                type: "error",
                message: "No access token"
            });
        }// if

        const accessToken = authorization.split(" ")[1];

        const id = await jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET).id;
        const user = await User.findById(id);

        if (!id || !user) {
            return res.status(403).json({
                type: "error",
                message: "Invalid access token"
            });
        }// if

        req.user = user;
        next();

    } catch (error) {
        res.status(500).json({
            type: "error",
            message: "Error authenticating user"
        });
    }// catch

}

module.exports = authenticate;