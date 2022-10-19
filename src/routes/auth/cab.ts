import express from "express";
import { registerCab } from "../../controller/auth/cab";
const router = express.Router();

router.post("/register", registerCab);

export { router as authCabRouter };
