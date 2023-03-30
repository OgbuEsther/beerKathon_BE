import dotenv from "dotenv";

dotenv.config();

const EnvironmentalVariables = {
  PORT: process.env.PORT as string,
  MONGODB_STRING: process.env.LIVE_URL as string,
};

export default EnvironmentalVariables;
