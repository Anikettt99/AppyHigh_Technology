import { NextFunction, Request, Response } from "express";
import { Rider } from "../../models/rider";
import { Password } from "../../utils/password";

const signUp = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { name, phone, password } = request.body;
    const existingRider = await Rider.findOne({ phone: phone });
    if (existingRider) {
      return response.status(400).json({
        success: false,
        message: "Rider already exist! Login to continue!",
        data: null,
      });
    }

    const hashedPassword = await Password.hashPassword(password);
    const rider = Rider.build({
      name,
      phone,
      password: hashedPassword,
    });
    await rider.save();

    return response.status(201).json({
      success: true,
      message: "Sign Up Successfully!",
      data: rider,
    });
  } catch (error) {
    console.log("Server Error at signUp in auth/rider.ts => Error : ", error);
    return response.status(500).json({
      success: false,
      message: "Server Error! Failed to signUp!",
      data: error,
    });
  }
};

const signIn = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { phone, password } = request.body;
    const existingRider = await Rider.findOne({ phone: phone });

    if (!existingRider) {
      return response.status(401).json({
        success: false,
        message: "Invalid Credentials!",
        data: null,
      });
    }
    const passwordMatch = await Password.comaparePassword(
      existingRider.password,
      password
    );

    if (!passwordMatch) {
      return response.status(401).json({
        success: false,
        message: "Invalid Credentials!",
        data: null,
      });
    }

    return response.status(201).json({
      success: true,
      message: "Sign In Successfull!",
      data: existingRider,
    });
  } catch (error) {
    console.log("Server Error at signIn in auth/rider.ts => Error : ", error);
    return response.status(500).json({
      success: false,
      message: "Server Error! Failed to signIn!",
      data: error,
    });
  }
};

export { signUp, signIn };
