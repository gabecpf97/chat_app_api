import { findAndRemoveFrom } from "../HelperFunctions/helpers";
import Message from "../models/message";
import Reaction from "../models/reaction";

const addReaction = (message, user, reaction) => {
  Message.findById(message).exec((err, theMessage) => {
    if (err) {
      return err;
    } else if (!theMessage) {
      return new Error("Message cannot be found");
    } else {
      const newReaction = new Reaction({
        user,
        value: reaction,
      });
      newReaction.save((err) => {
        if (err) {
          return err;
        } else {
          return { success: true };
        }
      });
    }
  });
};

const removeReaction = (message, reaction) => {
  Message.findById(message).exec((err, theMessage) => {
    if (err) {
      return err;
    } else if (!theMessage) {
      return new Error("Message cannot be found");
    } else {
      Reaction.findById(reaction).exec((err, theReaction) => {
        if (err) {
          return err;
        } else if (!theReaction) {
          return new Error("Reaction cannot be found");
        } else {
          const new_reactions = findAndRemoveFrom(
            theMessage.reactions,
            theReaction._id
          );
          Message.findByIdAndUpdate(
            theMessage._id,
            { reactions: new_reactions },
            {},
            (err, newMessage) => {
              if (err) {
                return err;
              } else {
                Reaction.findByIdAndDelete(theReaction._id, (err) => {
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

const reactionController = { addReaction, removeReaction };

export default reactionController;
