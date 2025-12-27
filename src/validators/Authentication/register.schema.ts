import { z } from "zod";

export const registerUserSchema = z.object({
  email: z.email("Email inválido"),
  password: z.string().min(8, "Nome deve ter pelo menos 8 caracteres")
});

export type RegisterUserInput = z.infer<typeof registerUserSchema>;