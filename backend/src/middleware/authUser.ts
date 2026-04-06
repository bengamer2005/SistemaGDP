import { Request, Response, NextFunction } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"

interface CustomJwtPayload extends JwtPayload {
    users_id: number
    email: string
    role_id: number
}

declare global {
    namespace Express {
        interface Request {
            user?: CustomJwtPayload
        }
    }
}

const authUser = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization

    if(!authHeader) {
        return res.status(401).json({ message: "Token requerido"})
    }

    const token = authHeader.split(" ")[1]

    try {
        const decoded = jwt.verify(
            token, 
            process.env.JWT_SECRET as string
        ) as CustomJwtPayload

        req.user = decoded
        next()
    } catch (error) {
        return res.status(401).json({ message: "Token inválido o expirado" })
    }
}

export default authUser