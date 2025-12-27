import { OrderDTO } from "../../dto/Order/createOrder.dto";
import { CreateOrderResponseDTO } from "../../dto/Order/createOrderResponse.dto";
import { OrderResponseDTO } from "../../dto/Order/orderResponse.dto";
import { PaginatedResponseDTO } from "../../dto/Order/paginatedResponse.dto";
import { PaginationDTO } from "../../dto/Order/pagination.dto";

import { Order } from "../../models/Order";

export class OrderService{
    static async getListOrders({page, limit} : PaginationDTO): Promise<PaginatedResponseDTO<OrderResponseDTO>>{
        const skip = (page - 1) * limit;


        const [orders, total] = await Promise.all([
            Order.find()
            .sort({createdAt: -1})
            .skip(skip)
            .limit(limit)
            .exec(),

            Order.countDocuments().exec()
        ]);

        const mappedOrders: OrderResponseDTO[] = orders.map(order => ({
            id: String(order._id),
            lab: order.lab,
            patient: order.patient,
            customer: order.customer,
            state: order.state,
            status: order.status,
            services: order.services
        }));

        return{
            data: mappedOrders,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        }
    }

    static async create(userId: string, data: OrderDTO): Promise<CreateOrderResponseDTO>{
        const newOrder = await Order.create({
            ...data,
            ownerId: userId
        });

        if(!newOrder){
            throw new Error("Erro ao criar novo pedido");
        }

        return{
            id: String(newOrder._id),
            patient: newOrder.patient,
            customer: newOrder.customer
        };
    }
}