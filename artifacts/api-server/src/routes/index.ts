import { Router, type IRouter } from "express";
import healthRouter from "./health";
import { profitPulseRouter } from "../profit-pulse";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/profit-pulse", profitPulseRouter);

export default router;
