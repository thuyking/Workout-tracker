import { useMutation } from '@tanstack/react-query'
import { TrophyOutlined } from '@ant-design/icons'
import { Button, Card, Form, Input, Typography, message } from 'antd'
import { Link, useNavigate } from 'react-router-dom'

import LanguageSelect from '../../../shared/components/LanguageSelect'
import { useTranslation } from '../../../shared/i18n/useTranslation'
import { useAuthStore } from '../../../stores/authStore'
import { register, type RegisterPayload } from '../api/authApi'

function RegisterPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)
  const { t } = useTranslation()

  const registerMutation = useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      setAuth(data.user, data.token)
      navigate('/')
    },
    onError: () => {
      message.error(t('auth.registerFailed'))
    },
  })

  const handleSubmit = (values: RegisterPayload) => {
    registerMutation.mutate(values)
  }

  return (
    <main className="fit-auth-shell">
      <Card className="fit-auth-card">
        <div className="mb-7 flex flex-col gap-4 min-[420px]:flex-row min-[420px]:items-start min-[420px]:justify-between">
          <div className="flex items-center gap-4">
            <div className="fit-brand-mark">
              <TrophyOutlined />
            </div>
            <div>
              <Typography.Title level={3} className="fit-title !mb-1">
                {t('auth.registerTitle')}
              </Typography.Title>
              <Typography.Text className="fit-subtitle">
                {t('dashboard.subtitle')}
              </Typography.Text>
            </div>
          </div>
          <LanguageSelect />
        </div>
        <Form layout="vertical" size="large" onFinish={handleSubmit}>
          <Form.Item
            label={t('auth.fullName')}
            name="name"
            rules={[{ required: true, message: t('auth.fullNameRequired') }]}
          >
            <Input placeholder="Nguyen Van A" />
          </Form.Item>

          <Form.Item
            label={t('common.email')}
            name="email"
            rules={[{ required: true, message: t('auth.emailRequired') }]}
          >
            <Input type="email" placeholder="you@example.com" />
          </Form.Item>

          <Form.Item
            label={t('common.password')}
            name="password"
            rules={[{ required: true, message: t('auth.passwordRequired') }]}
          >
            <Input.Password placeholder={t('auth.passwordPlaceholder')} />
          </Form.Item>

          <Button
            block
            type="primary"
            htmlType="submit"
            loading={registerMutation.isPending}
          >
            {t('actions.register')}
          </Button>
        </Form>

        <Typography.Paragraph className="!mt-4 !mb-0">
          {t('auth.loginPrompt')} <Link to="/login">{t('actions.login')}</Link>
        </Typography.Paragraph>
      </Card>
    </main>
  )
}

export default RegisterPage
