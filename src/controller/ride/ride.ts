import { NextFunction, Request, Response } from "express";
import { Cab, CabDoc } from "../../models/cabs";
import { getDistance } from "geolib";
import { Location, Ride } from "../../models/rides";
//import { getDistance } from "../../utils/calculateDistance";

const findRides = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { lat, long } = request.query;
    if (!lat && !long) {
      return response.status(500).json({
        success: false,
        message: "Invalid Params!",
        data: null,
      });
    }
    const nearByCabs: Array<CabDoc> = [];
    const allCabs = await Cab.find({ onRide: false }).populate({
      path: "owner",
      select: "working",
    });

    allCabs.forEach((cab) => {
      let distance = getDistance(
        { latitude: Number(lat), longitude: Number(long) },
        {
          latitude: Number(cab.location.latitude),
          longitude: Number(cab.location.longitude),
        }
      );

      if (distance <= 5000) {
        nearByCabs.push(cab);
      }
    });

    return response.status(200).json({
      success: false,
      message: "Cabs found successfully!",
      data: nearByCabs,
    });
  } catch (error) {
    console.log("Server Error at findRides in ride/ride.ts => Error : ", error);
    return response.status(500).json({
      success: false,
      message: "Server Error! Failed to find Cab!",
      data: error,
    });
  }
};

const calculateRidePrice = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const pickUp: Location = request.body.pickup;
    const dropOff: Location = request.body.dropoff;

    const distance = getDistance(
      {
        latitude: Number(pickUp.latitude),
        longitude: Number(pickUp.longitude),
      },
      {
        latitude: Number(dropOff.latitude),
        longitude: Number(dropOff.longitude),
      }
    );

    const price = distance * 0.02;
    return response.status(200).json({
      success: true,
      message: "Here your final Price!",
      data: price,
    });
  } catch (error) {
    console.log(
      "Server Error at calculateRidePrice in ride/ride.ts => Error : ",
      error
    );
    return response.status(500).json({
      success: false,
      message: "Server Error! Failed to calculate price!",
      data: error,
    });
  }
};

const bookRide = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { riderId, driverId } = request.body;
    const pickUp: Location = request.body.pickUp;
    const dropOff: Location = request.body.dropOff;

    const distance = getDistance(
      {
        latitude: Number(pickUp.latitude),
        longitude: Number(pickUp.longitude),
      },
      {
        latitude: Number(dropOff.latitude),
        longitude: Number(dropOff.longitude),
      }
    );

    const price = distance * 0.02;

    const ride = Ride.build({
      riderId,
      driverId,
      bookingTime: new Date().toISOString(),
      pickUp,
      dropOff,
      price,
    });

    await ride.save();

    await Cab.findOneAndUpdate(
      { owner: driverId },
      {
        $set: {
          onRide: true,
        },
      }
    );

    return response.status(201).json({
      success: true,
      message: "Cab Booked Successfully!!",
      data: ride,
    });
  } catch (error) {
    console.log("Server Error at bookRide in ride/ride.ts => Error : ", error);
    return response.status(500).json({
      success: false,
      message: "Server Error! Failed to book Ride!",
      data: error,
    });
  }
};

const startRide = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { rideId } = request.body;
    const ride = await Ride.findOneAndUpdate(
      { _id: rideId },
      {
        $set: {
          startTime: new Date().toISOString(),
          status: "On The Way",
        },
      },
      {
        new: true,
      }
    );

    return response.status(200).json({
      success: true,
      message: "Ride Started Successfully!",
      data: ride,
    });
  } catch (error) {
    console.log("Server Error at startRide in ride/ride.ts => Error : ", error);
    return response.status(500).json({
      success: false,
      message: "Server Error! Failed to start Ride!",
      data: error,
    });
  }
};

const endRide = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { rideId } = request.body;
    const ride = await Ride.findOneAndUpdate(
      {
        _id: rideId,
      },
      {
        $set: {
          status: "Finished",
          paymentStaus: "Paid",
          endTime: new Date().toISOString(),
        },
      },
      {
        new: true,
      }
    );

    console.log();
    await Cab.findOneAndUpdate(
      { owner: ride?.driverId },
      {
        $set: {
          onRide: false,
        },
      }
    );
    return response.status(200).json({
      success: true,
      message: "Ride Ended Successfully!",
      data: ride,
    });
  } catch (error) {
    console.log("Server Error at endRide in ride/ride.ts => Error : ", error);
    return response.status(500).json({
      success: false,
      message: "Server Error! Failed to end Ride!",
      data: error,
    });
  }
};

const cancelRide = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { rideId } = request.body;
    const ride = await Ride.findOneAndUpdate(
      { _id: rideId },
      {
        $set: {
          status: "Cancelled",
        },
      },
      {
        new: true,
      }
    );

    await Cab.findOneAndUpdate(
      { owner: ride?.driverId },
      {
        $set: {
          onRide: false,
        },
      }
    );
    return response.status(200).json({
      success: true,
      message: "Ride Cancelled Successfully!",
      data: ride,
    });
  } catch (error) {
    console.log(
      "Server Error at cancelRide in ride/ride.ts => Error : ",
      error
    );
    return response.status(500).json({
      success: false,
      message: "Server Error! Failed to cancel Ride!",
      data: error,
    });
  }
};
export {
  findRides,
  calculateRidePrice,
  bookRide,
  startRide,
  endRide,
  cancelRide,
};
