import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Create a new schema for users
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  profileImage: {
    type: String,
    default: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fstackoverflow.com%2Fquestions%2F49917726%2Fretrieving-default-image-all-url-profile-picture-from-facebook-graph-api&psig=AOvVaw1X783P478QCuazASDlGnpl&ust=1718959341019000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCMDYvNvk6YYDFQAAAAAdAAAAABAE"
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
});

// Encrypt the password before saving it
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model("UserJWT", UserSchema);

export default User;
