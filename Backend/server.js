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

const AuthRoutes = require("./Routes/Auth/Auth");
const AdminRoutes = require("./Routes/Admin/admin");
const DashboardRoutes = require("./Routes/Dashboard/Dashboard");

const app = express();

dotenv.config();

ConnectDB();


// =========================================
// CORS
// =========================================

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true
    })
);


// =========================================
// MIDDLEWARE
// =========================================

app.use(cookieParser());

app.use(express.json());


// =========================================
// ROUTES
// =========================================

app.use(
    "/",
    AuthRoutes
);

app.use(
    "/admin",
    UserLogin,
    AdminOnly,
    AdminRoutes
);

app.use(
    "/dashboard",
    UserLogin,
    UserOnly,
    DashboardRoutes
);


// =========================================
// CURRENT USER
// =========================================

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


// =========================================
// MAKE SOCKET.IO AVAILABLE
// =========================================

setSocketIO(io);


// =========================================
// SOCKET CONNECTION
// =========================================

io.on("connection", (socket) => {

    console.log(
        "User connected:",
        socket.id
    );

    socket.emit(
        "welcome",
        {
            message:
                "IndiaScape real-time connection working!"
        }
    );

    socket.on(
        "disconnect",
        () => {

            console.log(
                "User disconnected:",
                socket.id
            );

        }
    );

});


// =========================================
// SERVER START
// =========================================

server.listen(
    3000,
    () => {

        console.log(
            "Backend Start"
        );

    }
);