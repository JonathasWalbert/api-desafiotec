import z from "zod";

export const serviceSchema = z.object({
        name: z.string().min(1, "Nome do serviço é obrigatório"),
        value: z.number().min(0, "Valor do serviço deve ser positivo"),
        status: z.enum(['PENDING', 'DONE']).default('PENDING'),
});

export type ServiceInput = z.infer<typeof serviceSchema>;