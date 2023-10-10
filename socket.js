const socketController = (io) => {
  io.on("connection", (socket) => {
    socket.on("sent-message", (message, room) => {
      socket.to(room).emit("receive-message", message);
    });

    socket.on("joined-room", (room, cb) => {
      const notice = `${socket.id} joined this room`;
      socket.join(room);
      socket.to(room).emit("receive-message", notice);
      cb(notice);
    });
  });
};

export default socketController;
