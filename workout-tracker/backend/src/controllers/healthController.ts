import type { Request, Response } from 'express'

export const getHealth = (_req: Request, res: Response): void => {
  res.status(200).json({
    status: 'ok',
    service: 'workout-tracker-backend',
    message: 'Backend deployed successfully',
    timestamp: new Date().toISOString(),
  })
}
