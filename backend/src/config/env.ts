//Loads environment variables (MONGO_URI, PORT, JWT_SECRET).

import dotenv from "dotenv";
dotenv.config();


export const env = {
  PORT: process.env.PORT || "4000",
  MONGO_URI: process.env.MONGO_URI as string,
  JWT_SECRET: process.env.JWT_SECRET as string,
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
};

