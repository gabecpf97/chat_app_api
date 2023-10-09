const socketController = (io) => {
  io.on("connection", (socket) => {
    console.log(`${socket.id} is connected`);
  });
};

export default socketController;
