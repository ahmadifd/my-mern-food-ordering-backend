import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(
      //"mongodb://127.0.0.1:27017/my-mern-food-ordering"
      "mongodb+srv://ahmadifd:47mcOiksjZjyvH1Y@cluster0.jad41dh.mongodb.net/my-mern-food-ordering"
      );
  } catch (err) {
    console.log(err);
  }
};
