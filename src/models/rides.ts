import mongoose from "mongoose";
import { DriverDoc } from "./driver";
import { RiderDoc } from "./rider";

interface Location {
  longitude: string;
  latitude: string;
  address: string;
}

interface RideAttrs {
  riderId: mongoose.Types.ObjectId;
  driverId: mongoose.Types.ObjectId;
  bookingTime: string;
  pickUp: Location;
  dropOff: Location;
  price: number;
}

interface RideDoc extends mongoose.Document {
  riderId: RiderDoc;
  driverId: DriverDoc;
  startTime: string;
  bookingTime: string;
  endTime: string;
  pickUp: Location;
  dropOff: Location;
  price: number;
  createdAt: string;
  updatedAt: string;
}

interface RideModel extends mongoose.Model<RideDoc> {
  build(attrs: RideAttrs): RideDoc;
}
const rideSchema = new mongoose.Schema(
  {
    riderId: {
      type: mongoose.Types.ObjectId,
      ref: "Rider",
      required: true,
    },
    driverId: {
      type: mongoose.Types.ObjectId,
      ref: "Driver",
      required: true,
    },
    bookingTime: {
      type: String,
      required: true,
    },
    startTime: {
      type: String,
      default: "",
    },
    endTime: {
      type: String,
      default: "",
    },
    pickUp: {
      longitude: {
        type: String,
        required: true,
      },
      latitude: { type: String, required: true },
      address: { type: String, required: true },
    },
    dropOff: {
      longitude: {
        type: String,
        required: true,
      },
      latitude: { type: String, required: true },
      address: { type: String, required: true },
    },
    status: {
      type: String,
      enum: ["Booked", "On The Way", "Finished", "Cancelled"],
      default: "Booked",
    },
    paymentStaus: {
      type: String,
      enum: ["Paid", "Not Paid"],
      default: "Not Paid",
    },
    paymentType: {
      type: String,
      enum: ["Cash", "Online"],
      default: "Cash",
    },
    price: {
      type: Number,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

rideSchema.statics.build = (attrs: RideAttrs) => {
  return new Ride(attrs);
};

const Ride = mongoose.model<RideDoc, RideModel>("Ride", rideSchema);

export { Ride, Location };
