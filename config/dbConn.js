import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(process.env.CONNECTION_STRING, {
      dbName: "my-mern-food-ordering",
    });
  } catch (err) {
    console.log(err);
  }
};
