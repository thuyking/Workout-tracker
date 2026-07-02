import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

interface JwtPayload {
  userId: string
}

export interface AuthRequest extends Request {
  userId?: string
}

export const protect = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Not authorized, token missing' })
    return
  }

  const token = authHeader.split(' ')[1]
  const jwtSecret = process.env.JWT_SECRET

  if (!jwtSecret) {
    res.status(500).json({ message: 'JWT_SECRET is not configured' })
    return
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as JwtPayload
    req.userId = decoded.userId
    next()
  } catch {
    res.status(401).json({ message: 'Not authorized, token invalid' })
  }
}
