import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`Connected to MongoDB ${conn.connection.host}`);
  } catch (err) {
    console.log(`Error connecting to MongoDB ${err}`);
    process.exit(1); // Exit the process with an error code
  }
};
