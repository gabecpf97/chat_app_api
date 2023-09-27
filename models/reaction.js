import { Schema, model } from "mongoose";

const Reaction = model('Reaction', new Schema({
    user: {type: Schema.Types.ObjectId, ref: "User", required: true},
    value: {tyep: String}
}));

export default Reaction;