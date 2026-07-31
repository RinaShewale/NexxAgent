import mongoose from "mongoose";

export async function connectDB() {
  try {
    const connection = await mongoose.connect(
      process.env.SANDBOX_MONGO_URL
    );

    console.log(
      `✅ MongoDB connected: ${connection.connection.host}`
    );

  } catch (error) {

    console.error(
      "❌ MongoDB connection failed:",
      error.message
    );

    process.exit(1);
  }
}