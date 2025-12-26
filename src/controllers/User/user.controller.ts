import { Request, Response } from "express";
import { registerUserSchema } from "../../validators/User/register.schema.js";
import { UserService } from "../../services/user.service.js";
import { loginUserSchema } from "../../validators/User/login.schema.js";

export async function registerUser(req: Request, res: Response) {
  try {
    const data = registerUserSchema.parse(req.body);

    const newUser = await UserService.create(data);

    return res.status(201).json(newUser);
  } catch (error: any) {
    return res.status(400).json({
      error: error.message || "Erro ao registrar novo usuário",
    });
  }
}

export async function loginUser(req: Request, res: Response) {
  try {
    const data = loginUserSchema.parse(req.body);

    const token = await UserService.login(data);

    return res.status(200).json(token);
  } catch (error: any) {
    return res.status(400).json({
      error: error.message || "Erro ao logar usuario",
    });
  }
}

