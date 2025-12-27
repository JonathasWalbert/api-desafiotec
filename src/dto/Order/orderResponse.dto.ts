export interface OrderResponseDTO{
    id: string;
    lab: string;
    patient: string;
    customer: string;
    state: string;
    status: string;
    services: {
        name: string;
        value: number;
    }[];
}