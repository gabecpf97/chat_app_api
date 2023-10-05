import { body, check, validationResult } from "express-validator";
import Room from "../models/room";

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
 */
const create_room = [
  body("title").trim().escape(),
  (req, res, next) => {
    const theRoom = new Room({
      owner: req.user._id,
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
  },
];

const roomController = {
  get_room,
};

export default roomController;
