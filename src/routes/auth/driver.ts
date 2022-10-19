import express from "express";
import {
  sendVerifyEmail,
  signIn,
  signUp,
  verifyEmail,
} from "../../controller/auth/driver";

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/send-verify-email", sendVerifyEmail);
router.get("/verify-email/:token", verifyEmail);

export { router as authDriverRouter };
