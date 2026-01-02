import { OrderDTO } from "../../dto/Order/createOrder.dto";
import { CreateOrderResponseDTO } from "../../dto/Order/createOrderResponse.dto";
import { ServiceDTO } from "../../dto/Order/createService.dto";
import { OrderResponseDTO } from "../../dto/Order/orderResponse.dto";
import { PaginatedResponseDTO } from "../../dto/Order/paginatedResponse.dto";
import { PaginationDTO } from "../../dto/Order/pagination.dto";
import { OrderRepository } from "../../repositories/Order/order.repository";

export class OrderService {
  static async getListOrders({
    page,
    limit,
    state,
  }: PaginationDTO): Promise<PaginatedResponseDTO<OrderResponseDTO>> {
    const { orders, total } = await OrderRepository.list({ page, limit, state });

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

    const newOrder = await OrderRepository.create({
      ...data,
      ownerId: userId,
      total,
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
    orderId: string
  ): Promise<OrderResponseDTO> {
    //buscar o pedido, ajustar o flow da mudança de state e salvar
    const order = await OrderRepository.findById(orderId);

    if (!order) {
      throw new Error("Pedido não encontrado.");
    }

    const flow: Array<"CREATED" | "ANALYSIS" | "COMPLETED"> = [
      "CREATED",
      "ANALYSIS",
      "COMPLETED",
    ];

    const currentIndex = flow.indexOf(order.state);

    if (currentIndex === -1) {
      throw new Error("Estado inválido do pedido.");
    }

    if (currentIndex === flow.length - 1) {
      throw new Error(`Pedido já está state de ${order.state}.`);
    }

    const nextState = flow[currentIndex + 1];

    const updatedOrder = await OrderRepository.updateState(orderId, nextState);

    if(!updatedOrder){
      throw new Error("Erro ao atualizar o estado do pedido.");
    }

    const mapped: OrderResponseDTO = {
      id: String(updatedOrder._id),
      lab: updatedOrder.lab,
      patient: updatedOrder.patient,
      customer: updatedOrder.customer,
      total: updatedOrder.total,
      state: updatedOrder.state,
      status: updatedOrder.status,
      services: updatedOrder.services,
    };

    return mapped;
  }

  static async addService(
    orderId: string,
    data: ServiceDTO
  ): Promise<OrderResponseDTO> {
    //buscar o pedido, adicionar o servico, atualizar o total e salvar)
    const existsOrder = await OrderRepository.findById(orderId);

    if(!existsOrder){
      throw new Error("Pedido não encontrado.");
    }

    const newTotal = existsOrder.total + data.value;

    const orderUpdated = await OrderRepository.addService(orderId, newTotal, data);

    return {
      id: String(orderUpdated!._id),
      lab: orderUpdated!.lab,
      patient: orderUpdated!.patient,
      customer: orderUpdated!.customer,
      total: orderUpdated!.total,
      state: orderUpdated!.state,
      status: orderUpdated!.status,
      services: orderUpdated!.services, 
    }}
}
