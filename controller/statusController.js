import { checkErrorsAndReturn } from "../HelperFunctions/helpers";
import Message from "../models/message";
import Status from "../models/status";
import User from "../models/user";

const changeStatus = (message, user) => {
  Message.findById(message).exec((err, theMessage) => {
    const messageError = checkErrorsAndReturn(err, theMessage, "message");
    if (!messageError.noError) {
      return messageError.error;
    } else {
      User.findById(user).exec((err, theUser) => {
        const userError = checkErrorsAndReturn(err, theUser, "user");
        if (!userError.noError) {
          return userError.error;
        } else {
          const theStatus = new Status({
            user: theUser._id,
            value: true,
          });
          const newStatus = [...theMessage.status, theStatus];
          Message.findByIdAndUpdate(
            theMessage,
            { status: newStatus },
            {},
            (err, updatedMessage) => {
              const updateError = checkErrorsAndReturn(
                err,
                updatedMessage,
                "message"
              );
              if (!updateError.noError) {
                return updateError.error;
              } else {
                theStatus.save((err) => {
                  if (err) {
                    return err;
                  } else {
                    return { success: true };
                  }
                });
              }
            }
          );
        }
      });
    }
  });
};

const statusController = { changeStatus };

export default statusController;
