import { CreateUserDTO, UserResponseDTO } from "../dto/user.dto.js";
import { User } from "../models/User.js";


export class UserService {
  static async create(data: CreateUserDTO): Promise<UserResponseDTO> {
    const userExists = await User.findOne({ email: data.email });

    if (userExists) {
      throw new Error("Usuário já existe");
    }

    const user = await User.create(data);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    };
  }

  static async list(): Promise<UserResponseDTO[]> {
    const users = await User.find();

    return users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    }));
  }
}
