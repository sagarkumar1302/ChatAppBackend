import mongoose from "mongoose";
export const connectDB = async () => {
  try {
    const conn=await mongoose.connect(process.env.MONGODB_URI)
    console.log("Mongo db is connected"+ conn.connection.host);
    
} catch (error) {
      console.log("Connection is failed");
  }
};
