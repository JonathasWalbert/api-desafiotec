import { Request, Response } from "express";
import { orderSchema } from "../../validators/Order/order.schema";
import { OrderService } from "../../services/Order/order.service";
import z from "zod";

export async function getOrder(req: Request, res: Response) {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Number(req.query.limit) || 10, 100);

    const stateParams =
      typeof req.query.state === "string" ? req.query.state : undefined;
    const stateSchema = z.enum(["CREATED", "ANALYSIS", "COMPLETED"]).optional();
    const stateParsed = stateSchema.safeParse(stateParams);

    if (!stateParsed.success) {
      throw new Error("Estado inválido.");
    }

    const state = stateParsed.data;

    const listOrders = await OrderService.getListOrders({ page, limit, state });

    return res.status(200).json(listOrders);
  } catch (error: any) {
    console.error("Erro ao carregar pedidos: ", error.message);
    return res.status(500).json({
      error: error.message || "Erro ao carregar os pedidos",
    });
  }
}

export async function createOrder(req: Request, res: Response) {
  try {
    const userId = req.userId!;

    const data = orderSchema.parse(req.body);

    const result = await OrderService.create(userId, data);

    return res.status(201).json(result);
  } catch (error: any) {
    console.error("Erro ao criar pedido: ", error.message);
    return res
      .status(500)
      .json({ error: error.message || "Erro ao criar pedido" });
  }
}

export async function advanceOrder(req: Request, res: Response) {
  try {
    const userId = req.userId!;
    const orderId = req.params.id;

    const result = await OrderService.advance(orderId, userId);

    return res.status(200).json(result);
  } catch (error: any) {
    console.error("Erro ao avançar status do pedido: ", error.message);

    if (error.message && error.message.includes("não encontrado")) {
      return res.status(404).json({ error: error.message });
    }

    if (error.message && error.message.includes("não pertence")) {
      return res.status(403).json({ error: error.message });
    }

    if (
      error.message &&
      (error.message.includes("impossível") ||
        error.message.includes("já está") ||
        error.message.includes("inválido"))
    ) {
      return res.status(400).json({ error: error.message });
    }

    return res
      .status(500)
      .json({ error: error.message || "Erro ao avançar pedido" });
  }
}
