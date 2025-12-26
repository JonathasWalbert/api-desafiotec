import { z } from "zod";

export const loginUserSchema = z.object({
  email: z.email("Email inválido"),
  password: z.string().min(8, "Nome deve ter pelo menos 8 caracteres")
});

export type LoginUserInput = z.infer<typeof loginUserSchema>;