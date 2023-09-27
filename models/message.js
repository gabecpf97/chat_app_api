import { Schema, model } from "mongoose";

const Message = model('Message', new Schema({
    user: {type: Schema.Types.ObjectId, ref: "User", required: true},
    text: {type: String},
    media: {type: String},
    reactions: [{type: Schema.Types.ObjectId, ref: "Reaction"}],
    time_created: {type: Date, required: true},
    status: [{type: Schema.Types.ObjectId, ref: "Status"}],
}));

export default Message;