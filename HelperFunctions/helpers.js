import { createTransport } from "nodemailer";
import User from "../models/user";

const getDefaultName = async (req, theTitle) => {
  if (theTitle.length > 0) {
    return theTitle;
  } else {
    const members = req.body.participants;
    const suffix = "'s chat room";
    User.findById(req.user._id).exec((err, theOwner) => {
      if (err || !theOwner) {
        return "New Chat Room";
      } else {
        if (members.length == 0) {
          return `${theOwner.name}${suffix}`;
        } else if (members.length == 1) {
          User.findById(members[0]).exec((err, theUser) => {
            if (err || !theUser) {
              return theOwner.name + suffix;
            } else {
              return `${theOwner.name} and ${theUser.name}${suffix}`;
            }
          });
        } else {
          return `${theOwner.name} and the other${suffix}`;
        }
      }
    });
  }
};

const findAndRemoveFrom = (arr, item) => {
  const index = arr.indexOf(item);
  return [...arr.slice(0, index), ...arr.slice(index + 1)];
};

const transporter = createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_NAME,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

/**
 * Helper function to send reset code using email
 */
const sendEmailTo = async (userEmail, reset_code) => {
  const info = await transporter.sendMail({
    from: `"Chat app" <${process.env.EMAIL_NAME}>`,
    to: userEmail,
    subject: "Chat app password reset confirmation code",
    text: "Password reset confirmation code",
    html: `<H2>Code: </H2>
            <p>${reset_code}</p>`,
  });
  return info;
};

export { getDefaultName, findAndRemoveFrom, sendEmailTo };
