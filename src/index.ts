// import
import express, { NextFunction, Request, Response } from "express";
const cors = require("cors");
import { connectDb } from "./config/db.config";
import { config } from "./config/config";

//routes
import { authRouter } from "./routes/auth";
import { rideRouter } from "./routes/ride";
import { driverRouter } from "./routes/driver";
import { riderRouter } from "./routes/rider";

// initializing app
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/ride", rideRouter);
app.use("/api/v1/driver", driverRouter);
app.use("/api/v1/rider", riderRouter);

app.use(
  "/",
  async (request: Request, response: Response, next: NextFunction) => {
    response.send("cab-services server running...");
  }
);

const start = async () => {
  const PORT = config.PORT;
  await connectDb();
  app.listen(PORT, () => {
    console.log(`App Listening on PORT: ${PORT}`);
  });
};

start();
