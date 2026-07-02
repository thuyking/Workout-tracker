import dotenv from 'dotenv'
import type { Request, Response } from 'express'

import app from '../src/app'
import { connectDatabase } from '../src/config/db'

dotenv.config()

const handler = async (req: Request, res: Response): Promise<void> => {
  await connectDatabase()
  app(req, res)
}

export default handler
