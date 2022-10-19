import { NextFunction, Request, Response } from "express";
import { Ride } from "../../models/rides";
import moment from "moment";
import { earning } from "../../utils/earning";
const history = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { driverId } = request.params;

    const { page, limit } = request.query;
    const pageNumber = page ? page : 1;
    const itemsPerPage = limit ? limit : 15;
    const skipItems =
      (parseInt(pageNumber.toString()) - 1) * parseInt(itemsPerPage.toString());

    const history = await Ride.find({ driverId: driverId })
      .sort({ createdAt: 1 })
      .skip(skipItems)
      .limit(parseInt(itemsPerPage.toString()))
      .populate("riderId", "name phone");

    return response.status(200).json({
      success: true,
      message: "History Is Fetched Successfully!",
      data: history,
    });
  } catch (error) {
    console.log(
      "Server Error at history in driver/driver.ts => Error : ",
      error
    );
    return response.status(500).json({
      success: false,
      message: "Server Error! Failed to fetch history!",
      data: error,
    });
  }
};

const successfullRideLastWeek = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { driverId } = request.params;

    const startDate = moment()
      .subtract(1, "weeks")
      .startOf("isoWeek")
      .toISOString();
    const endDate = moment()
      .subtract(1, "weeks")
      .endOf("isoWeek")
      .toISOString();

    const createdAt = { $gte: startDate, $lte: endDate };
    const lastWeekRides = await Ride.find({
      driverId: driverId,
      createdAt: createdAt,
    }).count();
    return response.status(200).json({
      success: true,
      message: "Count!",
      data: lastWeekRides,
    });
  } catch (error) {
    console.log(
      "Server Error at successfullRideLastWeek in driver/driver.ts => Error : ",
      error
    );
    return response.status(500).json({
      success: false,
      message: "Server Error! Failed to fetch history!",
      data: error,
    });
  }
};

const mostEarningPreviousSevenDays = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { driverId } = request.params;
    const todayDate = new Date().toISOString();
    let mostEarning = 0;
    let thatDay = "";
    let current = moment(todayDate).subtract(1, "days").format("YYYY-MM-DD");
    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(current);

      const startDate = currentDate.setUTCHours(0, 0, 0, 0);
      const endDate = currentDate.setUTCHours(23, 59, 59, 999);
      // converting utc format
      const utcStartDate = startDate - 5 * 60 * 60 * 1000 - 30 * 60 * 1000;
      const utcEndDate = endDate - 5 * 60 * 60 * 1000 - 30 * 60 * 1000;
      const currentEarning = await earning(
        new Date(utcStartDate).toISOString(),
        new Date(utcEndDate).toISOString(),
        driverId
      );
      if (currentEarning.earning >= mostEarning) {
        mostEarning = currentEarning.earning;
        thatDay = currentEarning.date;
      }

      current = moment(current).subtract(1, "days").format("YYYY-MM-DD");
    }

    return response.status(200).json({
      success: true,
      message: "Data!",
      data: {
        earned: mostEarning,
        date: thatDay,
      },
    });
  } catch (error) {
    console.log(
      "Server Error at mostEarningPreviousSevenDays in driver/driver.ts => Error : ",
      error
    );
    return response.status(500).json({
      success: false,
      message: "Server Error! Failed to get Data!",
      data: error,
    });
  }
};

const earningDateRange = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { driverId } = request.params;
    const { startDate, endDate } = request.body;
    const start = new Date(startDate).setUTCHours(0, 0, 0, 0);
    const end = new Date(endDate).setUTCHours(23, 59, 59, 999);
    // it will be in milliseconds
    const utcStartDate = start - 5 * 60 * 60 * 1000 - 30 * 60 * 1000;
    const utcEndDate = end - 5 * 60 * 60 * 1000 - 30 * 60 * 1000;
    const currentEarning = await earning(
      new Date(utcStartDate).toISOString(),
      new Date(utcEndDate).toISOString(),
      driverId
    );
    return response.status(200).json({
      success: false,
      message: "Earning!",
      data: currentEarning.earning,
    });
  } catch (error) {
    console.log(
      "Server Error at earningDateRange in driver/driver.ts => Error : ",
      error
    );
    return response.status(500).json({
      success: false,
      message: "Server Error! Failed to get Data!",
      data: error,
    });
  }
};

export {
  history,
  successfullRideLastWeek,
  mostEarningPreviousSevenDays,
  earningDateRange,
};
