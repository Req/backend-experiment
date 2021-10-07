import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    thought: String,
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref:"thinkers" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref:"thinkers" }]
});
export const User = new mongoose.model("thinkers", userSchema);