import { Schema, model, Document } from "mongoose";

export interface UserProps extends Document {
  email: string;
  password: string;
}

const UserSchema = new Schema<UserProps>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 8 },
  },
  { timestamps: true }
);

export const User = model<UserProps>("User", UserSchema);
