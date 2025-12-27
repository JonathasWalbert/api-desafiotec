import { Request, Response } from "express";
import { orderSchema } from "../../validators/Order/order.schema";

export async function getOrder(req: Request, res: Response){
    try{

        return res.status(200).json({
            message: "Lista de pedidos carregada com sucesso"
        })
    }catch(error: any){
        console.error("Erro ao carregar pedidos: ", error.message)
        return res.status(500).json({
            error: error.message || "Erro ao carregar os pedidos",
        });
    }
}

export async function createOrder(req: Request, res: Response){
    try{
        const data = orderSchema.parse(req.body);

        return res.status(201).json(data);
    }catch(error: any){
        console.error("Erro ao criar pedido: ", error.message)
        return res.status(500).json({ error: error.message || "Erro ao criar pedido" })
    }

}