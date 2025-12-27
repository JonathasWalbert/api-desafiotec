export interface OrderDTO{
    lab: string;
    patient: string;
    customer: string;
    services: {
        name: string;
        value: number;
    }[];
}
