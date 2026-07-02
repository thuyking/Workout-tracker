import { Select } from 'antd'

import { useTranslation } from '../i18n/useTranslation'

function LanguageSelect() {
  const { language, setLanguage, t } = useTranslation()

  return (
    <Select
      aria-label={t('language.label')}
      value={language}
      size="small"
      className="w-16"
      options={[
        { value: 'vi', label: 'VI' },
        { value: 'en', label: 'EN' },
      ]}
      onChange={(value) => {
        void setLanguage(value)
      }}
    />
  )
}

export default LanguageSelect
