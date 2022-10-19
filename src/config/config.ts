require("dotenv").config({
  path:
    process.env.NODE_ENV === "production"
      ? ".env.production"
      : ".env.development",
});

const config = {
  PORT: process.env.PORT,
  DATABASE_URI: process.env.MONGO_DB_URI,
  SEND_GRID_KEY: process.env.SEND_GRID_API_KEY,
  JWT_KEY: process.env.JWT_KEY,
  OPEN_CAGE_API_KEY: process.env.OPEN_CAGE_API_KEY,
};

export { config };
