import jwt from "jsonwebtoken";
import { config } from "../config/config";

const generateJWT = (data: Object) => {
  return jwt.sign(data, config.JWT_KEY!);
};

const verifyJWT = (token: string) => {
  const decodedToken: any = jwt.verify(token, config.JWT_KEY!);
  const { data } = decodedToken;
  return data;
};

export { generateJWT, verifyJWT };
