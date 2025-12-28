import { OrderDTO } from "../../dto/Order/createOrder.dto";
import { PaginationDTO } from "../../dto/Order/pagination.dto";
import { Order } from "../../models/Order";

interface OrderRequestDTO{
    ownerId: string;
    total: number;
    lab: string;
    patient: string;
    customer: string;
    services: {
        name: string;
        value: number;
    }[];
}


export class OrderRepository{
    static async list({page, limit, state}: PaginationDTO){
        const skip = (page - 1) * limit;
        const filter = state ? { state } : {};

        const [orders, total] = await Promise.all([
            Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
            Order.countDocuments(filter).exec(),
        ]);

        return {orders, total};
    }

    static async create(data: OrderRequestDTO) {
        return Order.create({...data});
    }

    static async findById(id: string){
        return Order.findById(id).exec();
    }

    static async updateState(id: string, state: "CREATED" | "ANALYSIS" | "COMPLETED"){
        return Order.findByIdAndUpdate(id, {state}, {new: true}).exec();
    }
}