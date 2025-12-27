import z from "zod";

export const orderSchema = z.object({
    lab: z.string().min(1, "Lab é obrigatório"),
    patient: z.string().min(1, "Patient é obrigatório"),
    customer: z.string().min(1, "Customer é obrigatório"),
    state: z.enum(['CREATED', 'ANALYSIS', 'COMPLETED']).default('CREATED'),
    status: z.enum(['ACTIVE', 'DELETED']).default('ACTIVE'),
    services: z.array(z.object({
        name: z.string().min(1, "Nome do serviço é obrigatório"),
        value: z.number().min(0, "Valor do serviço deve ser positivo"),
        status: z.enum(['PENDING', 'DONE']).default('PENDING'),
    }))
});

export type OrderInput = z.infer<typeof orderSchema>;