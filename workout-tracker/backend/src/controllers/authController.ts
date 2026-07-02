import type { Request, Response } from 'express'

import { loginUser, registerUser } from '../services/authService'

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      res.status(400).json({ message: 'Name, email, and password are required' })
      return
    }

    const result = await registerUser({ name, email, password })
    res.status(201).json(result)
  } catch (error) {
    res.status(400).json({
      message: error instanceof Error ? error.message : 'Registration failed',
    })
  }
}

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' })
      return
    }

    const result = await loginUser({ email, password })
    res.status(200).json(result)
  } catch (error) {
    res.status(401).json({
      message: error instanceof Error ? error.message : 'Login failed',
    })
  }
}
