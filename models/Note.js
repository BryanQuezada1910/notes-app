import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Note = mongoose.model("Note", NoteSchema);

export default Note;

// userModel: {
//   type: String,
//   required: true,
//   enum: ["UserJWT", "GoogleUser"], // Enumera los modelos posibles
// },
