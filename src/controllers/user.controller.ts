import { Request, Response } from "express";
import { registerUserSchema } from "../validators/user.schema.js";
import { UserService } from "../services/user.service.js";

// export const createUser = async (req: Request, res: Response) => {
//   try {
//     const data = createUserSchema.parse(req.body);

//     const user = await UserService.create(data);

//     return res.status(201).json(user);
//   } catch (error: any) {
//     return res.status(400).json({
//       error: error.message || "Erro ao criar usuário"
//     });
//   }
// };

export async function registerUser(req: Request, res: Response){
  try {
    const data = registerUserSchema.parse(req.body);

    const newUser = await UserService.create(data);

    return res.status(201).json(newUser);
  } catch (error: any) {
    return res.status(400).json({
      error: error.message || "Erro ao registrar novo usuário"
    });
  }
};

// export const listUsers = async (_req: Request, res: Response) => {
//   try {
//     const users = await UserService.list();
//     return res.json(users);
//   } catch {
//     return res.status(500).json({ error: "Erro ao listar usuários" });
//   }
// };
