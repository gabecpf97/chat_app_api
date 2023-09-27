import { Schema, model } from "mongoose";

const Status = model('Status', new Schema({
    user: {type: Schema.Types.ObjectId, ref: "User", required: true},
    value: {type: Boolean, required: true}
}));

export default Status;