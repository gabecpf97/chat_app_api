import { body, check, validationResult } from "express-validator";
import Room from "../models/room";
import { getDefaultName } from "../HelperFunctions/helpers";

/**
 * api call to get room info
 */
const get_room = (req, res, next) => {
  Room.findById(req.params.id).exec((err, theRoom) => {
    if (err) {
      return next(err);
    } else {
      res.send({ theRoom });
    }
  });
};

/**
 * api call to create a chat room
 * maybe need to check participants values?
 */
const create_room = [
  body("title").trim().escape(),
  (req, res, next) => {
    const theTitle = getDefaultName(req, req.body.title);
    try {
      const theRoom = new Room({
        owner: req.user._id,
        title: theTitle,
        participants: req.body.participants,
        messages: [],
        medias: [],
      });
      theRoom.save((err) => {
        if (err) {
          return next(err);
        } else {
          res.send({ id: theRoom._id });
        }
      });
    } catch (err) {
      return next(err);
    }
  },
];

/**
 * api call to edit chat title
 */
const change_title = [
  (res, req, next) => {
    Room.findById(req.body.id).exec((err, theRoom) => {
      if (err) {
        return next(err);
      } else if (!theRoom) {
        return next(new Error("Chat doesn't exists"));
      } else {
        Room.findByIdAndUpdate(
          theRoom._id,
          { title: req.body.title },
          {},
          (err, newRoom) => {
            if (err) {
              return next(err);
            } else {
              res.send({ success: true, title: newRoom.title });
            }
          }
        );
      }
    });
  },
];

/**
 * api call to delete a chat rooom
 */
const delete_room = [
  (res, req, next) => {
    Room.findById(req.body.id).exec((err, theRoom) => {
      if (err) {
        return next(err);
      } else if (!theRoom) {
        return next(new Error("Chat doesn't exists"));
      } else {
        if (theRoom.owner !== req.body.user) {
          return next(new Error("Only owner can perform this action"));
        } else {
          Room.findByIdAndDelete(theRoom._id, (err) => {
            if (err) {
              return next(err);
            } else {
              res.send({ success: true });
            }
          });
        }
      }
    });
  },
];

const roomController = {
  get_room,
  create_room,
  change_title,
  delete_room,
};

export default roomController;
