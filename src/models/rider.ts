import mongoose from "mongoose";

interface RiderAttrs {
  name: string;
  phone: string;
  password: string;
}

interface RiderDoc extends mongoose.Document {
  name: string;
  email: string;
  phone: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}

interface RiderModel extends mongoose.Model<RiderDoc> {
  build(attrs: RiderAttrs): RiderDoc;
}

const riderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
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

riderSchema.statics.build = (attrs: RiderAttrs) => {
  return new Rider(attrs);
};

const Rider = mongoose.model<RiderDoc, RiderModel>("Rider", riderSchema);

export { Rider, RiderDoc };
