import express from "express";
import {
  rideBookInRange,
  totalAndAverageEarning,
} from "../controller/rider/rider";

const router = express.Router();

router.post("/spending/:riderId", rideBookInRange);
router.get("/average-spending/:riderId", totalAndAverageEarning);

export { router as riderRouter };
