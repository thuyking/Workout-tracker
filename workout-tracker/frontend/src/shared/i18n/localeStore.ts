import { create } from 'zustand'

import {
  getLocales,
  type LocaleMessages,
  type SupportedLanguage,
} from './localeApi'

const languageStorageKey = 'preferredLanguage'

const getInitialLanguage = (): SupportedLanguage => {
  const language = localStorage.getItem(languageStorageKey)

  return language === 'en' || language === 'vi' ? language : 'vi'
}

interface LocaleState {
  language: SupportedLanguage
  messages: LocaleMessages
  isLoading: boolean
  setLanguage: (language: SupportedLanguage) => Promise<void>
  loadMessages: () => Promise<void>
}

export const useLocaleStore = create<LocaleState>((set, get) => ({
  language: getInitialLanguage(),
  messages: {},
  isLoading: false,
  setLanguage: async (language) => {
    localStorage.setItem(languageStorageKey, language)
    set({ language })
    await get().loadMessages()
  },
  loadMessages: async () => {
    const { language } = get()

    set({ isLoading: true })

    try {
      const response = await getLocales(language)

      set({
        language: response.lang,
        messages: response.messages,
      })
    } finally {
      set({ isLoading: false })
    }
  },
}))
