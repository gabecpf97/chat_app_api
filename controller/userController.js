import { compare, hash } from "bcrypt";
import { body, check, validationResult } from "express-validator";
import passport from "passport";
import { sign } from "jsonwebtoken";
import User from "../models/user";

/**
 * api call to get user info
 */
const get_user = (req, res, next) => {
  User.findById(req.user._id, "name email rooms contacts").exec(
    (err, theUser) => {
      if (err) {
        return next(err);
      }
      res.send({ theUser });
    }
  );
};

/**
 * api call to create user
 */
const create_user = [
  body("username", "Username must be longer than 3 letter")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  check("username").custom(async (value) => {
    return new Promise((resolve, reject) => {
      User.findOne({ name: value }).exec((err, theUser) => {
        if (!theUser) {
          return resolve(true);
        } else {
          return reject("Username already exists");
        }
      });
    });
  }),
  body("email", "Please enter a valid email address")
    .normalizeEmail()
    .isEmail()
    .escape(),
  check("email").custom(async (value) => {
    return new Promise((resolve, reject) => {
      User.findOne({ email: value }).exec((err, theUser) => {
        if (!theUser) {
          return resolve(true);
        } else {
          return reject("Email address already registed an account");
        }
      });
    });
  }),
  check("password")
    .trim()
    .isLength({ min: 8 })
    .withMessage("Password must be longer than 8 character")
    .custom((value) => {
      return /\d/.test(value);
    })
    .withMessage("Password must include numbers"),
  check("confirm_password", "Please enter the password you entered")
    .escape()
    .custom((value, { req }) => {
      return value === req.body.password;
    }),
  (req, res, next) => {
    const errors = validationResult(req);
    const user = new User({
      name: req.body.username,
      email: req.body.email,
    });
    if (!errors.isEmpty()) {
      res.send({ errors: errors.array });
    } else {
      hash(req.body.password, 10, (err, hashedPassword) => {
        if (err) {
          return next(err);
        }
        user.password = hashedPassword;
        user.save((err) => {
          if (err) {
            return next(err);
          }
          const token = sign({ user }, "sercet_key");
          res.send({ token, user });
        });
      });
    }
  },
];

const log_in = async (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err || !user) {
      return next(new Error(info.message));
    }
    req.login(user, { session: false }, (err) => {
      if (err) {
        return next(err);
      }
      const token = sign({ user }, process.env.S_KEY || "");
      res.send({
        token,
        theUser: {
          username: user.name,
        },
      });
    });
  });
};

/**
 * api call for updating username and email
 */
const edit_user = [
  body("username", "Username must be longer than 3 letter")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  check("username").custom(async (value) => {
    return new Promise((resolve, reject) => {
      User.findOne({ name: value }).exec((err, theUser) => {
        if (!theUser) {
          return resolve(true);
        } else {
          return reject("Username already exists");
        }
      });
    });
  }),
  body("email", "Please enter a valid email address")
    .normalizeEmail()
    .isEmail()
    .escape(),
  check("email").custom(async (value) => {
    return new Promise((resolve, reject) => {
      User.findOne({ email: value }).exec((err, theUser) => {
        if (!theUser) {
          return resolve(true);
        } else {
          return reject("Email address already registed an account");
        }
      });
    });
  }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(errors.array());
    } else {
      User.findById(req.user._id).exec((err, theUser) => {
        if (err) {
          return next(err);
        }
        const updated = {
          name: req.username,
          email: req.email,
        };
        User.findByIdAndUpdate(req.user._id, updated, {}, (err, theUser) => {
          if (err) {
            return next(err);
          }
          res.send({
            success: true,
            user: { username: theUser.name, email: theUser.email },
          });
        });
      });
    }
  },
];

const change_password = [
  check("password").custom((value, { req }) => {
    return new Promise((resolve, reject) => {
      User.findById(req.user._id).exec((err, theUser) => {
        if (theUser) {
          compare(value, theUser.password, (err, result) => {
            if (result) {
              return resolve(true);
            } else {
              return reject("password incorrect");
            }
          });
        } else {
          return reject("No such user");
        }
      });
    });
  }),
  check("newPassword")
    .trim()
    .isLength({ min: 8 })
    .withMessage("Password must be longer than 8 character")
    .custom((value) => {
      return /\d/.test(value);
    })
    .withMessage("Password must include numbers"),
  check("confirm_newPassword", "Please enter the password you entered")
    .escape()
    .custom((value, { req }) => {
      return value === req.body.newPassword;
    }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty) {
      return next(errors.array());
    } else {
      hash(req.body.newPassword, 10, (err, hashedPassword) => {
        if (err) {
          return next(err);
        } else {
          User.findByIdAndUpdate(
            req.user._id,
            { password: hashedPassword },
            {},
            (err, theUser) => {
              if (err) {
                return next(err);
              }
              res.send({ success: true });
            }
          );
        }
      });
    }
  },
];

const userController = {
  get_user,
  create_user,
  log_in,
  edit_user,
  change_password,
};

export default userController;
