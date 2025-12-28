import { describe, it, expect, vi, afterEach } from "vitest";
import { OrderService } from "../../src/services/Order/order.service";
import { OrderRepository } from "../../src/repositories/Order/order.repository";

const mockOrderFactory = (overrides: any = {}) => ({
  _id: "orderId",
  ownerId: "user1",
  lab: "lab",
  patient: "patient",
  customer: "customer",
  total: 100,
  state: "CREATED",
  status: "ACTIVE",
  services: [],
  save: vi.fn().mockResolvedValue(undefined),
  ...overrides,
});

describe("Fluxo de state da Order", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("Alterar state de CREATED para ANALYSIS", async () => {
    const order = mockOrderFactory();
    const updatedOrder = { ...order, state: "ANALYSIS" };

    const findSpy = vi
      .spyOn(OrderRepository, "findById")
      .mockResolvedValue(order as any);
    const updateSpy = vi
      .spyOn(OrderRepository, "updateState")
      .mockResolvedValue(updatedOrder as any);

    const res = await OrderService.advance("orderId");

    expect(findSpy).toHaveBeenCalledWith("orderId");
    expect(updateSpy).toHaveBeenCalledWith("orderId", "ANALYSIS");
    expect(res.state).toBe("ANALYSIS");
  });

  it("Alterar state de ANALYSIS para COMPLETED", async () => {
    const order = mockOrderFactory({ state: "ANALYSIS" });
    const updatedOrder = { ...order, state: "COMPLETED" };

    const findSpy = vi
      .spyOn(OrderRepository, "findById")
      .mockResolvedValue(order as any);
    const updateSpy = vi
      .spyOn(OrderRepository, "updateState")
      .mockResolvedValue(updatedOrder as any);

    const res = await OrderService.advance("orderId");

    expect(findSpy).toHaveBeenCalledWith("orderId");
    expect(updateSpy).toHaveBeenCalledWith("orderId", "COMPLETED");
    expect(res.state).toBe("COMPLETED");
  });

  it("Tenta pular CREATED para COMPLETED (não permitido)", async () => {
    const order = mockOrderFactory({ state: "CREATED" });

    const findSpy = vi
      .spyOn(OrderRepository, "findById")
      .mockResolvedValue(order as any);
    // Simula um repositório malicioso que aceitaria atualizar direto para COMPLETED
    const updateSpy = vi
      .spyOn(OrderRepository, "updateState")
      .mockImplementation(async (id: string, state: any) => {
        if (state === "COMPLETED") {
          throw new Error("Atualização direta para COMPLETED não permitida");
        }
        return { ...order, state } as any;
      });

    const res = await OrderService.advance("orderId");

    expect(findSpy).toHaveBeenCalledWith("orderId");
    expect(updateSpy).toHaveBeenCalledWith("orderId", "ANALYSIS");
    expect(res.state).toBe("ANALYSIS");
  });

  it("Tenta sair de COMPLETED para ANALYSIS (não permitido)", async () => {
    const order = mockOrderFactory({ state: "COMPLETED" });

    const findSpy = vi
      .spyOn(OrderRepository, "findById")
      .mockResolvedValue(order as any);
    const updateSpy = vi
      .spyOn(OrderRepository, "updateState")
      .mockResolvedValue({} as any);

    await expect(OrderService.advance("orderId")).rejects.toThrowError(
      "Pedido já está state de COMPLETED."
    );

    expect(findSpy).toHaveBeenCalledWith("orderId");
    expect(updateSpy).not.toHaveBeenCalled();
  });

  it("Não permite retroceder de ANALYSIS para CREATED", async () => {
    const order = mockOrderFactory({ state: "ANALYSIS" });

    const findSpy = vi
      .spyOn(OrderRepository, "findById")
      .mockResolvedValue(order as any);

    // Simula um repositório que tentaria forçar o estado para CREATED
    const updateSpy = vi
      .spyOn(OrderRepository, "updateState")
      .mockImplementation(async (id: string, state: any) => {
        // se chamado com CREATED, retornar esse estado (simulando má conduta)
        return { ...order, state } as any;
      });

    const res = await OrderService.advance("orderId");

    // O serviço deve avançar para COMPLETED a partir de ANALYSIS, não retroceder para CREATED
    expect(findSpy).toHaveBeenCalledWith("orderId");
    expect(updateSpy).toHaveBeenCalledWith("orderId", "COMPLETED");
    expect(updateSpy).not.toHaveBeenCalledWith("orderId", "CREATED");
    expect(res.state).toBe("COMPLETED");
  });

  it("Erro quando o pedido ja estiver com state de COMPLETED", async () => {
    const order = mockOrderFactory({ state: "COMPLETED" });
    vi.spyOn(OrderRepository, "findById").mockResolvedValue(order as any);

    await expect(OrderService.advance("orderId")).rejects.toThrowError(
      "Pedido já está state de COMPLETED."
    );
  });

  it("Error quando estiver com state inválido.", async () => {
    const order = mockOrderFactory({ state: "INVALID" as any });
    vi.spyOn(OrderRepository, "findById").mockResolvedValue(order as any);

    await expect(OrderService.advance("orderId")).rejects.toThrowError(
      "Estado inválido do pedido."
    );
  });

  it("Erro quando não encontrar o pedido", async () => {
    vi.spyOn(OrderRepository, "findById").mockResolvedValue(null as any);

    await expect(OrderService.advance("orderId")).rejects.toThrow(
      "Pedido não encontrado."
    );
  });
});
