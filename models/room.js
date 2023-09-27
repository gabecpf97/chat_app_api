import { Schema, model } from "mongoose";

const Room = model('Room', new Schema({
    user: [{type: Schema.Types.ObjectId, ref: "User"}],
    messages: [{type: Schema.Types.ObjectId, ref:"Message"}],
    medias:[{type: String}],
}));

export default Room;