import { Schema, model } from "mongoose";

const Room = model(
  "Room",
  new Schema({
    owner: { type: Schema.Types.ObjectId, required: true },
    title: { type: String, required: true },
    participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
    messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
    medias: [{ type: String }],
  })
);

export default Room;
