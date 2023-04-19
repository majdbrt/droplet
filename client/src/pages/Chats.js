import React, { useEffect } from "react";
import ChatPane from "../components/ChatPane";
import MessageBoard from "../components/MessageBoard";
import authAPI from "../api/authApi";
import { socket } from "../api/socket";

function Chats() {


    useEffect(() => {

        authAPI.get("/users/" + localStorage.getItem("userID"))
            .then((response) => {
                localStorage.setItem("userID", response.data.userID);

                // connect socket and register the userID as it is own room
                // this will allow easy tracking of sockets belonging to same user
                socket.connect();
                socket.emit("register", response.data.userID);

            }).catch((error) => {
                console.log(error);
                console.log(error.status)
            });


        return () => {
            socket.disconnect();
        }
    }, [])


    return (
        <div className="flex w-screen">
            <ChatPane />
            <MessageBoard />
        </div>

    );
}

export default Chats;

