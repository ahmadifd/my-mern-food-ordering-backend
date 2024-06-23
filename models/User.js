import mongoose from "mongoose";
import timestamp from "mongoose-timestamp";

const userSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    default: () => new mongoose.Types.ObjectId(),
  },
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  addressLine1: {
    type: String,
  },
  city: {
    type: String,
  },
  country: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  roles: {
    type: [String],
    default: ["User"],
  },
  active: {
    type: Boolean,
    default: true,
  },
  refreshToken: String,
});

userSchema.plugin(timestamp);

export default mongoose.model("User", userSchema);
