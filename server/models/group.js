const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
    participents: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message'
        }
    ],

},
    { timestamps: true }
);

const Group = mongoose.model("Group", groupSchema);

module.exports = {
    groupSchema,
    Group
}