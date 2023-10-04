import { Schema, model } from "mongoose";

const User = model(
  "User",
  new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    rooms: [{ type: Schema.Types.ObjectId, ref: "Room" }],
    contacts: [{ Types: Schema.Types.ObjectId, ref: "User" }],
    reset_code: { type: String },
  })
);

export default User;
