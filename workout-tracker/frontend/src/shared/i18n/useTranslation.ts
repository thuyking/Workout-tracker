import { useCallback } from 'react'

import { useLocaleStore } from './localeStore'

type Params = Record<string, string | number>

const getValueByKey = (messages: Record<string, unknown>, key: string) => {
  return key.split('.').reduce<unknown>((value, keyPart) => {
    if (!value || typeof value !== 'object') {
      return undefined
    }

    return (value as Record<string, unknown>)[keyPart]
  }, messages)
}

const replaceParams = (text: string, params?: Params) => {
  if (!params) {
    return text
  }

  return Object.entries(params).reduce(
    (result, [key, value]) => result.replaceAll(`{{${key}}}`, String(value)),
    text,
  )
}

export const useTranslation = () => {
  const language = useLocaleStore((state) => state.language)
  const messages = useLocaleStore((state) => state.messages)
  const setLanguage = useLocaleStore((state) => state.setLanguage)
  const isLoading = useLocaleStore((state) => state.isLoading)

  const t = useCallback(
    (key: string, params?: Params) => {
      const value = getValueByKey(messages, key)

      if (typeof value !== 'string') {
        return key
      }

      return replaceParams(value, params)
    },
    [messages],
  )

  return {
    isLoading,
    language,
    setLanguage,
    t,
  }
}
