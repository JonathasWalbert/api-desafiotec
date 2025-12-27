import { Request, Response } from "express";
import { orderSchema } from "../../validators/Order/order.schema";
import { OrderService } from "../../services/Order/order.service";

export async function getOrder(req: Request, res: Response){
    try{
        const page = Math.max(Number(req.query.page) || 1, 1);
        const limit = Math.min(Number(req.query.limit) || 10, 100);
        const listOrders = await OrderService.getListOrders({page, limit});

        return res.status(200).json(listOrders)
    }catch(error: any){
        console.error("Erro ao carregar pedidos: ", error.message)
        return res.status(500).json({
            error: error.message || "Erro ao carregar os pedidos",
        });
    }
}

export async function createOrder(req: Request, res: Response){
    try{
        const userId = req.userId!;

        const data = orderSchema.parse(req.body);
        
        const result = await OrderService.create(userId, data);

        return res.status(201).json(result);
    }catch(error: any){
        console.error("Erro ao criar pedido: ", error.message)
        return res.status(500).json({ error: error.message || "Erro ao criar pedido" })
    }

}
