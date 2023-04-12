import { io } from 'socket.io-client';
const URL = "http://localhost:3001";

export const socket = io(URL, {
 autoConnect:false
});

socket.on("connect", () => {
    console.log("User connected:" , socket.id); 
    socket.emit("userID", localStorage.getItem("userID"));

});

socket.on("disconnect", ()=>{
    console.log("User disconnected:" , socket.id); 
})


