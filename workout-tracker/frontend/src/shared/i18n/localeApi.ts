import { axiosClient } from '../api/axiosClient'

export type SupportedLanguage = 'vi' | 'en'
export type LocaleMessages = Record<string, unknown>

export interface LocaleResponse {
  lang: SupportedLanguage
  messages: LocaleMessages
}

export const getLocales = async (
  lang: SupportedLanguage,
): Promise<LocaleResponse> => {
  const response = await axiosClient.get<LocaleResponse>('/locales', {
    params: { lang },
  })

  return response.data
}
