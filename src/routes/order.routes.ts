import { Router } from "express";
import {
  createOrder,
  getOrder,
  advanceOrder,
  createService,
} from "../controllers/Order/order.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.get("/", getOrder);
router.post("/", createOrder);
router.patch("/:id/advance", advanceOrder);
router.patch("/:id", createService);

export default router;
