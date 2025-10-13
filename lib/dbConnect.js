import mongoose from "mongoose";
const mongodbURI = process.env.MONGODB_URL;
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const dbConnect = async () => {
  if (cached.conn) {
    console.log("already Connected");
    return cached.conn;
  }
  if (!cached.promise) {
    const opts = {
      bufferCommands: true,
    };

    cached.promise = mongoose.connect(mongodbURI, opts).then((mongoose) => {
      console.log("Connected to MongoDB");
      return mongoose;
    });
  }
};

export default dbConnect;
