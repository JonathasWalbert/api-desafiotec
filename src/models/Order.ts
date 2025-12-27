import { model, Schema } from "mongoose";

export interface OrdeProps{
    lab: string;
    patient: string;
    customer: string;
    state: 'CREATED' | 'ANALYSIS' | 'COMPLETED';
    status: 'ACTIVE' | 'DELETED';
    services: {
        name: string;
        value: number;
        status: 'PENDING' | 'DONE';
    }[];
}

const OrderSchema = new Schema<OrdeProps>({
    lab: { type: String, required: true },
    patient: { type: String, required: true },
    customer: { type: String, required: true },
    state: { type: String, enum: ['CREATED', 'ANALYSIS', 'COMPLETED'], default: 'CREATED' },
    status: { type: String, enum: ['ACTIVE', 'DELETED'], default: 'ACTIVE' },
    services: [
        {
            name: { type: String, required: true },
            value: { type: Number, required: true },
            status: { type: String, enum: ['PENDING', 'DONE'], default: 'PENDING' },
        }
    ],
}, 
    { timestamps: true }
);

export const Order = model<OrdeProps>("Order", OrderSchema);
