import mongoose from "mongoose";

interface DriverAttrs {
  name: string;
  email: string;
  phone: string;
  password: string;
  licenceNo: string;
  expiryDate: string;
}

interface DriverDoc extends mongoose.Document {
  name: string;
  email: string;
  phone: string;
  password: string;
  working: boolean;
  isEmailVerified: boolean;
  licenceNo: string;
  expiryDate: string;
  createdAt: string;
  updatedAt: string;
}

interface DriverModel extends mongoose.Model<DriverDoc> {
  build(attrs: DriverAttrs): DriverDoc;
}

const driverSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    licenceNo: {
      type: String,
      required: true,
    },
    expiryDate: {
      type: String,
      required: true,
    },
    working: {
      type: Boolean,
      default: true,
    },
    password: {
      type: String,
      required: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.isDeleted;
      },
    },
  }
);

driverSchema.statics.build = (attrs: DriverAttrs) => {
  return new Driver(attrs);
};

const Driver = mongoose.model<DriverDoc, DriverModel>("Driver", driverSchema);

export { Driver, DriverDoc };
