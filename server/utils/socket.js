const { User } = require("../models/user");
const { Group } = require("../models/group");
const { Message } = require("../models/message");

exports.socketConnection = async (io) => {
    io.on("connection", (socket) => {


        socket.on("register", async (userID) => {
            await socket.join(userID);

            user = await User.findById(userID);
            const groups = await getUserGroups(user);
            groups.map(async (group) => {
                await socket.join(group._id.toHexString());
            });
            
            io.to(userID).emit("refreshChatPane", groups);
        });

        socket.on("addGroup", async (data) => {
            const { userID, contactEmail } = data;
            try {

                const contactUser = await User.findOne({
                    email: contactEmail
                });
                if (!contactUser || contactUser._id.toHexString() === userID) {
                    io.to(userID).emit("exception", { message: "User not found" });

                }// if
                else {
                    const user = await User.findById(userID);
                    const participents = [user, contactUser];

                    const group = await Group.findOne({
                        participents: { "$all": participents }
                    });
                    if (group) {
                        io.to(userID).emit("exception", { message: "Contact is already added" });
                    }
                    else {
                        const newGroup = new Group({
                            participents: participents
                        });
                        await newGroup.save();

                        const newGroupInfo = await Group.findOne({
                            participents: { "$all": participents }
                        }).populate("participents");

                        await io.in(userID).socketsJoin(newGroupInfo._id.toHexString());
                        await io.in(contactUser._id.toHexString()).socketsJoin(newGroupInfo._id.toHexString());

                        newGroupInfo.participents.map(async (participent) => {
                            const updatedUserGroups = await getUserGroups(participent);

                            await io.to(participent._id.toHexString()).emit("refreshChatPane", updatedUserGroups);
                        });

                    }// else
                }// else
            } catch (error) {
                io.to(userID).emit("exception", { message: "Error adding contact" })
            }
        })


        socket.on("deleteGroup", async (groupID) => {

            try {
                const group = await Group.findById(groupID).populate("participents");

                await Group.deleteOne({ _id: groupID });
                await Message.deleteMany({ group: groupID });

                group.participents.map(async (participent) => {
                    const updatedUserGroups = await getUserGroups(participent);
                    io.in(participent._id.toHexString()).socketsLeave(groupID);
                    io.to(participent._id.toHexString()).emit("refreshChatPane", updatedUserGroups);
                });
            } catch (error) {
                console.log(error);
                socket.emit("exception", { message: "Error deleting group" });
            }
        });

        socket.on("sendMessage", async (message) => {

            const newMessage = await new Message({
                createdBy: message.createdByID,
                group: message.groupID,
                body: message.body
            }).save();

           const group = await Group.findOneAndUpdate(
                {
                    _id: message.groupID
                },
                {
                    "$push": {
                        messages: newMessage._id
                    }
                }
            );
            group.participents.map(async (participent) => {
                const updatedUserGroups = await getUserGroups(participent);
                io.to(participent._id.toHexString()).emit("refreshChatPane", updatedUserGroups);
            });
            io.in(message.groupID).emit("message", newMessage);
        });

        socket.on("getMessages", async (data) => {
            if (!data.number) {
                const messages = await Message.find({
                    group: data.groupID
                }).sort({ 'createdAt': -1 }).limit(12);

                await socket.emit("messages", messages);
            }
            else {
                const messages = await Message.find({
                    group: data.groupID
                }).sort({ 'createdAt': -1 }).limit(data.number);

                await socket.emit("messages", messages);

            }

        });

        socket.on("getMoreMessages", async (message) => {
            if (message) {
                const messages = await Message.find({
                    group: message.group,
                    createdAt: {
                        "$lt": message.createdAt
                    }
                }).sort({ 'createdAt': -1 }).limit(10);

                await socket.emit("sendingMoreMessages", messages);
            }// if
        });

        socket.on("diconnect", () => {
            console.log("user disconnected", socket.id);
        });
    });
}

async function getUserGroups(user) {

    const groups = await Group.find({
        participents: { "$in": user }
    }).populate(
        {
            path: "participents",
            select: "firstName lastName email isActive",
            match: { _id: { "$ne": user._id } }
        }).populate({
            path: "messages",
            select: "body createdBy",
            perDocumentLimit: 1,
            options: {
                sort: { createdAt: -1 }
            }
        }).select(" participents messages createdAt updatedAt").sort({ updatedAt: -1 }).exec();

    return groups;
}
