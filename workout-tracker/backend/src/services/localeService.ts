import { en } from '../locales/en'
import { vi } from '../locales/vi'

export type SupportedLanguage = 'vi' | 'en'

const messagesByLanguage = {
  vi,
  en,
}

export const defaultLanguage: SupportedLanguage = 'vi'

export const getSupportedLanguage = (language?: string): SupportedLanguage => {
  if (language === 'en' || language === 'vi') {
    return language
  }

  return defaultLanguage
}

export const getLocaleMessages = (language?: string) => {
  const lang = getSupportedLanguage(language)

  return {
    lang,
    messages: messagesByLanguage[lang],
  }
}
