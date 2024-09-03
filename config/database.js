import mongoose from "mongoose";

export const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connected to MongoDB\nDatabase: ${mongoose.connection.name} 🚀\nHost: ${mongoose.connection.host}\nPort: ${mongoose.connection.port}`);
  } catch (error) {
    console.log("Error connecting to MongoDB", error);
  }
};