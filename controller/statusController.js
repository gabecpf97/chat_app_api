import Status from "../models/status";
import User from "../models/user";

const changeStatus = (user) => {
  User.findById(user).exec((err, theUser) => {
    if (err) {
      return err;
    } else if (!theUser) {
      return new Error("User doesn't exist");
    } else {
      const theStatus = new Status({
        user: theUser._id,
        value: true,
      });
      theStatus.save((err) => {
        if (err) {
          return err;
        } else {
          return { theStatus };
        }
      });
    }
  });
};

const statusController = { changeStatus };

export default statusController;
