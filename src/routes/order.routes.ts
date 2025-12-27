import { Router } from "express";
import { createOrder, getOrder } from "../controllers/Order/order.controller";

const router = Router();

//aplicar middleware de autenticação aqui

router.get("/", getOrder);
router.post("/", createOrder);

export default router;