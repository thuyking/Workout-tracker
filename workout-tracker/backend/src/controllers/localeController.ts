import type { Request, Response } from 'express'

import { getLocaleMessages } from '../services/localeService'

export const getLocales = (req: Request, res: Response): void => {
  const language = typeof req.query.lang === 'string' ? req.query.lang : undefined

  res.status(200).json(getLocaleMessages(language))
}
