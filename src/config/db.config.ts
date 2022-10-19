import mongoose from "mongoose";
import { config } from "./config";

const connectDb = async () => {
  try {
    const db = await mongoose.connect(`${config.DATABASE_URI}`);
    console.log(
      `Database Connection Successfully! : ${db.connections[0].name}`
    );
  } catch (error) {
    console.log(`Database Connection Error : ', ${error}`);
  }
};

export { connectDb };
