import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "userModel", // Referencia dinámica al modelo de usuario
  },
  userModel: {
    type: String,
    required: true,
    enum: ["UserJWT", "GoogleUser"], // Enumera los modelos posibles
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Note = mongoose.model("Note", NoteSchema);

export default Note;
