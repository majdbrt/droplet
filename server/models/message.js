const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group'
    },
    body: String
},
    { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

module.exports = {
    messageSchema,
    Message
}