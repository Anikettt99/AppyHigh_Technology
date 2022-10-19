import express from "express";
import {
  bookRide,
  calculateRidePrice,
  cancelRide,
  endRide,
  findRides,
  startRide,
} from "../controller/ride/ride";

const router = express.Router();

router.get("/find-rides", findRides);
router.post("/calculate-price", calculateRidePrice);
router.post("/book-ride", bookRide);
router.put("/start-ride", startRide);
router.put("/cancel-ride", cancelRide);
router.put("/end-ride", endRide);

export { router as rideRouter };
