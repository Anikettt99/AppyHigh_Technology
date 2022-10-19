import { NextFunction, Request, Response } from "express";
import { Cab } from "../../models/cabs";

const registerCab = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { licensePlate, modelId, manufactureYear, owner, location } =
      request.body;
    const existingCab = await Cab.findOne({ modelId: modelId });
    if (existingCab) {
      return response.status(400).json({
        success: false,
        message: "Cab already exist! ",
        data: null,
      });
    }

    const cab = Cab.build({
      licensePlate,
      modelId,
      manufactureYear,
      owner,
      location,
    });

    await cab.save();
    return response.status(201).json({
      success: true,
      message: "Cab Registered Successfully!",
      data: cab,
    });
  } catch (error) {
    console.log(
      "Server Error at registerCab in auth/cab.ts => Error : ",
      error
    );
    return response.status(500).json({
      success: false,
      message: "Server Error! Failed to register Cab!",
      data: error,
    });
  }
};

export { registerCab };
