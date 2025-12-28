import { describe, it, expect, vi, afterEach } from "vitest";
import { OrderService } from "../../src/services/Order/order.service";
import { Order } from "../../src/models/Order";

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
    vi.spyOn(Order, "findById").mockReturnValue({
      exec: () => Promise.resolve(order),
    } as any);

    const res = await OrderService.advance("orderId", "user1");

    expect(order.save).toHaveBeenCalled();
    expect(res.state).toBe("ANALYSIS");
  });

  it("Alterar state de ANALYSIS para COMPLETED", async () => {
    const order = mockOrderFactory({ state: "ANALYSIS" });
    vi.spyOn(Order, "findById").mockReturnValue({
      exec: () => Promise.resolve(order),
    } as any);

    const res = await OrderService.advance("orderId", "user1");

    expect(order.save).toHaveBeenCalled();
    expect(res.state).toBe("COMPLETED");
  });

//   it("Erro quando o pedido ja estiver com state de COMPLETED", async () => {
//     const order = mockOrderFactory({ state: "COMPLETED" });
//     vi.spyOn(Order, "findById").mockReturnValue({
//       exec: () => Promise.resolve(order),
//     } as any);

//     await expect(OrderService.advance("orderId", "user1")).rejects.toThrowError(
//       "Pedido já está state de COMPLETED."
//     );
//   });

  it("Error quando estiver com state inválido.", async () => {
    const order = mockOrderFactory({ state: "INVALID" as any });
    vi.spyOn(Order, "findById").mockReturnValue({
      exec: () => Promise.resolve(order),
    } as any);

    await expect(OrderService.advance("orderId", "user1")).rejects.toThrowError(
      "Estado inválido do pedido."
    );
  });

  it("Erro quando não encontrar o pedido", async () => {
    vi.spyOn(Order, "findById").mockReturnValue({
      exec: () => Promise.resolve(null),
    } as any);

    await expect(OrderService.advance("orderId", "user1")).rejects.toThrow(
      "Pedido não encontrado."
    );
  });
});
