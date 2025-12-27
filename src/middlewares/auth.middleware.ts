import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface TokenPayload extends JwtPayload{
    userId: string;
}

declare global{
    namespace Express{
        interface Request{
            userId?: string;
        }
    }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: "Acesso negado." });
    }

    const parts = authHeader.split(" ");

    if (parts.length !== 2) {
        return res.status(401).json({ message: "Token inválido." });
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
        return res.status(401).json({ message: "Token mal formatado." });
    }

    try{
        const decode = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload

        req.userId = decode.userId;

        return next();
    }catch(err){
        console.error(err);
        return res.status(401).json({ message: "Token inválido ou expirado." });
    }

}