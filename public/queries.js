import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    user: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    mode: { type: String, enum: ['light', 'dark'], default: 'light' }
});
const CardSchema = new mongoose.Schema({
    title: { type: String, required: true },
    desc: { type: String },
    color: { type: String },
    index: { type: Number, required: true }
});
const NoteSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    todo: [CardSchema],
    doing: [CardSchema],
    done: [CardSchema]
});

export default class Queries {
    
}