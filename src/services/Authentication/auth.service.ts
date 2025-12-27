import { LoginUserDTO } from "../../dto/Authentication/login.dto.js";
import { RegisterUserDTO } from "../../dto/Authentication/register.dto.js";
import { UserResponseDTO } from "../../dto/Authentication/token.dto.js";
import { User } from "../../models/User.js";

import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export class AuthService {
  static async create(data: RegisterUserDTO): Promise<UserResponseDTO> {
    //Verificar se ja existe email criado, caso sim, retornar erro. Caso contrario, criar email e retornar token.
    const userExists = await User.findOne({ email: data.email });

    if (userExists) {
      throw new Error("Usuário já existe");
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const newUser = await User.create({
      email: data.email,
      password: passwordHash,
    });

    const token = jwt.sign({ email: newUser.email }, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });
    return {
      token,
    };
  }

  static async login(data: LoginUserDTO): Promise<UserResponseDTO> {
    //Procurar o email no banco de dados, verrificar a senha e retornar o token
    const user = await User.findOne({ email: data.email });

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    const passwordMatch = await bcrypt.compare(data.password, user.password);

    if (!passwordMatch) {
      throw new Error("Senha incorreta");
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });
    return {
      token,
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
