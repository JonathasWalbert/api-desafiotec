export interface OrderResponseDTO{
    id: string;
    lab: string;
    patient: string;
    customer: string;
    total: number;
    state: string;
    status: string;
    services: {
        name: string;
        value: number;
    }[];
}