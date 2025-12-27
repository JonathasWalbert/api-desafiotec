import { OrderDTO } from "../../dto/Order/createOrder.dto";
import { CreateOrderResponseDTO } from "../../dto/Order/createOrderResponse.dto";
import { OrderResponseDTO } from "../../dto/Order/orderResponse.dto";
import { PaginatedResponseDTO } from "../../dto/Order/paginatedResponse.dto";
import { PaginationDTO } from "../../dto/Order/pagination.dto";

import { Order } from "../../models/Order";

export class OrderService {
  static async getListOrders({
    page,
    limit,
    state,
  }: PaginationDTO): Promise<PaginatedResponseDTO<OrderResponseDTO>> {
    const skip = (page - 1) * limit;

    const filter = state ? { state } : {};

    const [orders, total] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),

      Order.countDocuments(filter).exec(),
    ]);

    const mappedOrders: OrderResponseDTO[] = orders.map((order) => ({
      id: String(order._id),
      lab: order.lab,
      patient: order.patient,
      customer: order.customer,
      total: order.total,
      state: order.state,
      status: order.status,
      services: order.services,
    }));

    return {
      data: mappedOrders,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async create(
    userId: string,
    data: OrderDTO
  ): Promise<CreateOrderResponseDTO> {
    //verificar se ha servico no pedido e verificar o total do pedido

    if(data.services.length === 0 || !data.services){
      throw new Error("O pedido deve conter ao menos um serviço.");
    }
    
    const total = data.services.reduce((sum, service) => sum + service.value, 0);

    if (total === 0){
      throw new Error("O total do pedido não pode ser zero.");
    }

    const newOrder = await Order.create({
      ...data,
      total,
      ownerId: userId,
    });

    if (!newOrder) {
      throw new Error("Erro ao criar novo pedido");
    }

    return {
      id: String(newOrder._id),
      patient: newOrder.patient,
      customer: newOrder.customer,
    };
  }

  static async advance(
    orderId: string,
    userId: string
  ): Promise<OrderResponseDTO> {
    const order = await Order.findById(orderId).exec();

    if (!order) {
      throw new Error("Pedido não encontrado.");
    }

    if (order.status === "DELETED") {
      throw new Error("Impossível avançar: pedido excluído.");
    }

    if (order.ownerId !== userId) {
      throw new Error(
        "Operação não permitida: pedido não pertence ao usuário."
      );
    }

    const flow: Array<"CREATED" | "ANALYSIS" | "COMPLETED"> = [
      "CREATED",
      "ANALYSIS",
      "COMPLETED",
    ];

    const currentIndex = flow.indexOf(order.state as any);

    if (currentIndex === -1) {
      throw new Error("Estado inválido do pedido.");
    }

    if (currentIndex === flow.length - 1) {
      throw new Error(`Pedido já está ${order.state}.`);
    }

    const nextState = flow[currentIndex + 1];

    order.state = nextState;

    await order.save();

    const mapped: OrderResponseDTO = {
      id: String(order._id),
      lab: order.lab,
      patient: order.patient,
      customer: order.customer,
      total: order.total,
      state: order.state,
      status: order.status,
      services: order.services,
    };

    return mapped;
  }
}
