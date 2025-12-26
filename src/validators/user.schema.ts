import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.email("Email inválido")
});

export type CreateUserInput = z.infer<typeof createUserSchema>;