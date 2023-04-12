require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const {Server} = require("socket.io");
const { createServer } = require("http");

const authRouter = require("./routes/auth");
const chatRouter = require("./routes/chat");
const usersRouter = require("./routes/users");
const groupsRouter = require("./routes/groups");

const {socketConnection} = require("./utils/socket");

const port = process.env.PORT || 3001;

const app = express();
app.use(express.json());
app.use(cookieParser());



const corsOptions = ({
    origin: process.env.FRONTEND_URL,
    credentials: true
});

app.use(cors(corsOptions));

const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true
    }
  });




(async () => {
    const URL = "mongodb+srv://" + process.env.DB_USERNAME + ":" + process.env.DB_PASSWORD + "@cluster0.nfhstee.mongodb.net/droplet?retryWrites=true&w=majority";

    await mongoose.connect(URL);
    console.log("connected to db");
})().catch(err => console.log(err));

app.use("/auth", authRouter);
app.use("/chat", chatRouter);
app.use("/users", usersRouter);
app.use("/groups", groupsRouter);

socketConnection(io);
/*
io.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);
    socket.on('disconnect', () => {
      console.log('🔥: A user disconnected');
    });
});

*/
httpServer.listen(port, ()=>{
    console.log(`listening on port ${port}`);
});
/*
app.listen(port, () => {
    console.log(`listening on port ${port}`);
})*/
