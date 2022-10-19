import { NextFunction, Request, Response } from "express";
import { Ride } from "../../models/rides";
import moment from "moment";
import { spending } from "../../utils/earning";
import { config } from "../../config/config";
import NodeGeocoder from "node-geocoder";
const rideBookInRange = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { riderId } = request.params;
    const { startDate, endDate } = request.body;
    const start = new Date(startDate).setUTCHours(0, 0, 0, 0);
    const end = new Date(endDate).setUTCHours(23, 59, 59, 999);
    // it will be in milliseconds
    const utcStartDate = start - 5 * 60 * 60 * 1000 - 30 * 60 * 1000;
    const utcEndDate = end - 5 * 60 * 60 * 1000 - 30 * 60 * 1000;
    const createdAt = { $gte: utcStartDate, $lte: utcEndDate };
    const rides = await Ride.find({ riderId: riderId, createdAt }).count();
    return response.status(200).json({
      success: true,
      message: "Data!",
      data: rides,
    });
  } catch (error) {
    console.log(
      "Server Error at rideBookInRange in rider/rider.ts => Error : ",
      error
    );
    return response.status(500).json({
      success: false,
      message: "Server Error! Failed to get Data!",
      data: error,
    });
  }
};

const totalAndAverageEarning = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { riderId } = request.params;

    const startDate = moment()
      .subtract(1, "weeks")
      .startOf("isoWeek")
      .toISOString();
    const endDate = moment()
      .subtract(1, "weeks")
      .endOf("isoWeek")
      .toISOString();

    const data = await spending(startDate, endDate, riderId);
    return response.status(200).json({
      success: true,
      message: "Data!",
      data: data,
    });
  } catch (error) {
    console.log(
      "Server Error at totalAndAverageEarning in rider/rider.ts => Error : ",
      error
    );
    return response.status(500).json({
      success: false,
      message: "Server Error! Failed to get Data!",
      data: error,
    });
  }
};

export { rideBookInRange, totalAndAverageEarning };
