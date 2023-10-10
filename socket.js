import messageController from "./controller/messageController";

const socketController = (io) => {
  io.on("connection", (socket) => {
    socket.on("sent-message", (message, room, cb) => {
      const result = messageController.createMessage(message);
      if (result.user) {
        socket.to(room).emit("receive-message", result.newMessage);
        cb(false);
      } else {
        cb(result);
      }
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
