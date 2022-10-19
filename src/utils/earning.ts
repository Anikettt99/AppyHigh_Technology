import { Ride } from "../models/rides";

const earning = async (
  startDate: string,
  endDate: string,
  driverId: string
) => {
  try {
    let totalEarning = 0;
    const createdAt = { $gte: startDate, $lte: endDate };
    const rides = await Ride.find({ driverId: driverId, createdAt: createdAt });
    for (let i = 0; i < rides.length; i++) {
      totalEarning += rides[i].price;
    }

    return {
      earning: totalEarning,
      date: startDate,
    };
  } catch (error) {
    throw new Error("Unknown Error");
  }
};

const spending = async (
  startDate: string,
  endDate: string,
  riderId: string
) => {
  try {
    let totatSpending = 0;
    const createdAt = { $gte: startDate, $lte: endDate };
    const rides = await Ride.find({ riderId: riderId, createdAt: createdAt });
    for (let i = 0; i < rides.length; i++) {
      totatSpending += rides[i].price;
    }

    return {
      totalRide: rides.length,
      totatSpending: totatSpending,
      averageSpending: totatSpending / (rides.length ? rides.length : 1),
    };
  } catch (error) {
    throw new Error("Unknown Error");
  }
};

export { earning, spending };
