import {  RegisterUserDTO, UserResponseDTO } from "../dto/user.dto.js";
import { User } from "../models/User.js";


export class UserService {
  static async create(data: RegisterUserDTO): Promise<UserResponseDTO> {
    const userExists = await User.findOne({ email: data.email });

    if (userExists) {
      throw new Error("Usuário já existe");
    }

    const newUser = await User.create(data);

    return {
      email: newUser.email
    };
  }

  // static async list(): Promise<UserResponseDTO[]> {
  //   const users = await User.find();

  //   return users.map(user => ({
  //     id: user.id,
  //     name: user.name,
  //     email: user.email,
  //     createdAt: user.createdAt
  //   }));
  // }
}
