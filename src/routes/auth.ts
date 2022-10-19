import express from "express";
import { authCabRouter } from "./auth/cab";
import { authDriverRouter } from "./auth/driver";
import { authRiderRouter } from "./auth/rider";
const router = express.Router();

router.use("/driver", authDriverRouter);
router.use("/rider", authRiderRouter);
router.use("/cab", authCabRouter);

export { router as authRouter };
