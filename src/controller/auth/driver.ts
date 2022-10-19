import { NextFunction, Request, Response } from "express";
import { Driver } from "../../models/driver";
import { Password } from "../../utils/password";
import { generateJWT, verifyJWT } from "../../utils/jwt";
import { sendMail } from "../../services/send-email";
import moment from "moment";
const signUp = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { name, email, phone, password, licenceNo, expiryDate } =
      request.body;

    if (!moment(expiryDate, "YYYY-MM-DD", true).isValid()) {
      return response.status(400).json({
        success: false,
        message: "Please enter a valid date or valid format!",
        data: null,
      });
    }
    const existingDriver = await Driver.findOne({ email: email });
    if (existingDriver) {
      return response.status(400).json({
        success: false,
        message: "Driver already exist! Login to continue!",
        data: null,
      });
    }

    const hashedPassword = await Password.hashPassword(password);
    const driver = Driver.build({
      name,
      email,
      phone,
      password: hashedPassword,
      licenceNo,
      expiryDate,
    });
    await driver.save();

    return response.status(201).json({
      success: true,
      message: "Sign Up Successfull!",
      data: driver,
    });
  } catch (error) {
    console.log("Server Error at signUp in auth/driver.ts => Error : ", error);
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
    const { email, password } = request.body;
    const existingDriver = await Driver.findOne({ email: email });

    if (!existingDriver) {
      return response.status(401).json({
        success: false,
        message: "Invalid Credentials!",
        data: null,
      });
    }
    const passwordMatch = await Password.comaparePassword(
      existingDriver.password,
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
      data: existingDriver,
    });
  } catch (error) {
    console.log("Server Error at signIn in auth/driver.ts => Error : ", error);
    return response.status(500).json({
      success: false,
      message: "Server Error! Failed to signIn!",
      data: error,
    });
  }
};

const sendVerifyEmail = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { to } = request.body;
    const token = generateJWT({ data: { email: to } });
    const body = `<h1>Click Below Link To Verify Your Email Address </h1>
      <a href="http://${request.headers.host}/api/v1/auth/driver/verify-email/${token}">VERIFY MY EMAIL ID<a>
      `;
    await sendMail(to, "Email Verification", body);
    return response.send({
      success: true,
      message: "Mail Sended Successfully!",
      data: null,
    });
  } catch (error) {
    console.log(
      "Server Error at sendVerifyEMail in auth/driver.ts => Error : ",
      error
    );
    return response.status(500).json({
      success: false,
      message: "Server Error! Failed to send mail!",
      data: error,
    });
  }
};

const verifyEmail = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { token } = request.params;
    const data = verifyJWT(token);
    const { email } = data;
    await Driver.findOneAndUpdate(
      { email: email },
      {
        $set: {
          isEmailVerified: true,
        },
      }
    );
    return response.status(200).json({
      success: true,
      message: "Email Verified",
      data: null,
    });
  } catch (error) {
    console.log(
      "Server Error at verifyEmail in auth/driver.ts => Error : ",
      error
    );
    return response.status(500).json({
      success: false,
      message: "Server Error! Failed to verify email!",
      data: null,
    });
  }
};

export { signUp, signIn, sendVerifyEmail, verifyEmail };
