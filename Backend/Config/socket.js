let io;

const setSocketIO = (socketIO) => {
    io = socketIO;
};

const getSocketIO = () => {
    if (!io) {
        throw new Error(
            "Socket.IO has not been initialized"
        );
    }

    return io;
};

module.exports = {
    setSocketIO,
    getSocketIO,
};