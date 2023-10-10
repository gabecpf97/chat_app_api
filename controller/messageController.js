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

const editMessage = (theUpdate) => {
  if (theUpdate.text) {
    const theText = theUpdate.text;
    if (theText.length < 1) {
      return new Error(
        "If you want to clear the message please remove the message"
      );
    }
    Message.findByIdAndUpdate(
      theUpdate.id,
      { text: theText },
      {},
      (err, newMessage) => {
        if (err) {
          return err;
        } else {
          return { newMessage };
        }
      }
    );
  }
};

const removeMessage = (messageID) => {
  Message.findById(messageID).exec((err, theMessage) => {
    if (err) {
      return err;
    } else if (!theMessage) {
      return new Error("Cannot find message");
    } else {
      Message.findByIdAndRemove(theMessage._id, (err) => {
        if (err) {
          return err;
        } else {
          return { success: true };
        }
      });
    }
  });
};

const messageController = { createMessage, editMessage, removeMessage };

export default messageController;
