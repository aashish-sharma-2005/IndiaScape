const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const ConnectDB = require("./Config/ConnectDb");
const cookieParser = require("cookie-parser");

const http = require("http");
const { Server } = require("socket.io");
const { setSocketIO } = require("./Config/socket");

const {
    UserLogin,
    CurrentUser,
    AdminOnly,
    UserOnly
} = require("./Midleware/Auth");

const app = express();

dotenv.config();

ConnectDB();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(cookieParser());

app.use(express.json());


// =========================================
// ROUTES
// =========================================

app.use(
    "/",
    require("./Routes/Auth/Auth")
);

app.use(
    "/admin",
    UserLogin,
    AdminOnly,
    require("./Routes/Admin/admin")
);

app.use(
    "/dashboard",
    UserLogin,
    UserOnly,
    require("./Routes/Dashboard/Dashboard")
);

app.get(
    "/me",
    UserLogin,
    CurrentUser
);


// =========================================
// SOCKET.IO SETUP
// =========================================

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true
    }
});


// Make Socket.IO available to controllers
setSocketIO(io);


// =========================================
// SOCKET CONNECTION
// =========================================

io.on("connection", (socket) => {

    console.log("User connected:", socket.id);

    socket.emit("welcome", {
        message: "IndiaScape real-time connection working!"
    });

    socket.on("disconnect", () => {

        console.log(
            "User disconnected:",
            socket.id
        );

    });

});


// =========================================
// SERVER START
// =========================================

server.listen(3000, () => {

    console.log("Backend Start");

});