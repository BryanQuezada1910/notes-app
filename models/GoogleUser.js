import e from "express";
import mongoose from "mongoose";

// Create a new schema for Google users
const GoogleUserSchema = new mongoose.Schema({
    googleId: {
        type: String,
        required: true,
    },
    displayName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    profileImage: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const GoogleUser = mongoose.model("GoogleUser", GoogleUserSchema);

export default GoogleUser;