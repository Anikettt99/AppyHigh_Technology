import mongoose from "mongoose";
import { DriverDoc } from "./driver";
import { Location } from "./rides";

interface CabAttrs {
  licensePlate: String;
  modelId: String;
  manufactureYear: String;
  owner: mongoose.Types.ObjectId;
  location: Location;
}

interface CabDoc extends mongoose.Document {
  licensePlate: String;
  modelId: String;
  manufactureYear: String;
  owner: DriverDoc;
  createdAt: string;
  updatedAt: string;
  location: Location;
}

interface CabModel extends mongoose.Model<CabDoc> {
  build(attrs: CabAttrs): CabDoc;
}
const cabSchema = new mongoose.Schema(
  {
    licensePlate: {
      type: String,
      required: true,
    },
    modelId: {
      type: String,
      required: true,
    },
    manufactureYear: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Types.ObjectId,
      ref: "Driver",
      required: true,
    },
    onRide: {
      type: Boolean,
      default: false,
    },
    location: {
      longitude: {
        type: String,
        required: true,
      },
      latitude: { type: String, required: true },
      address: { type: String, required: true },
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

cabSchema.statics.build = (attrs: CabAttrs) => {
  return new Cab(attrs);
};

const Cab = mongoose.model<CabDoc, CabModel>("Cab", cabSchema);

export { Cab, CabDoc };
