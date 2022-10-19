import express from "express";
import {
  earningDateRange,
  history,
  mostEarningPreviousSevenDays,
  successfullRideLastWeek,
} from "../controller/driver/driver";

const router = express.Router();

router.get("/history/:driverId", history);
router.get("/past-seven-days/success/:driverId", successfullRideLastWeek);
router.get("/most-earning/:driverId", mostEarningPreviousSevenDays);
router.post("/earning/range/:driverId", earningDateRange);
export { router as driverRouter };
