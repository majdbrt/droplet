const { sign } = require("jsonwebtoken");

function createAccessToken(id) {
    return sign({ id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn:  15*60 });
}

function createRefreshToken(id) {
    return sign({ id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "30d" })
}

module.exports = {
    createAccessToken,
    createRefreshToken
}