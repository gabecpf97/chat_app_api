import Message from "../models/message";

const createMessage = (theMessage) => {
  const newMessage = new Message({
    user: theMessage.user,
    time_created: new Date(),
    status: "sent",
  });
  if (theMessage.text) {
    newMessage.text = theMessage.text;
  } else if (theMessage.media) {
    newMessage.media = theMessage.media;
  }
  newMessage.save((err) => {
    if (err) {
      return err;
    } else {
      return { newMessage };
    }
  });
};

const messageController = { createMessage };

export default messageController;
