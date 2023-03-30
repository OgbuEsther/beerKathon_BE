import mongoose from "mongoose";
import EnvironmentalVariables from "./EnvironmentalVariables";

const db_Url = "mongodb://0.0.0.0:27017/endpoints";

// const LIVEURI = EnvironmentalVariables.MONGODB_STRING;

export const DBCONNECTION = async () => {
  try {
    const conn = await mongoose.connect(db_Url);
    console.log("");
    console.log(`Database is connected to ${conn.connection.host}`);
  } catch (error) {
    console.log(`${error}`);
  }
};
