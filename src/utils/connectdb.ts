import mongoose from "mongoose";

const connectDB = async (MONGODB_URL: string) => {
  try {
    const conn = await mongoose.connect(MONGODB_URL);
    console.log(`Connected to MongoDB: ${conn.connection.host}`);
  } catch (err) {
    console.log(err);
  }
};

export default connectDB;
