import { useMutation } from '@tanstack/react-query'
import { ThunderboltOutlined } from '@ant-design/icons'
import { Button, Card, Form, Input, Typography, message } from 'antd'
import { Link, useNavigate } from 'react-router-dom'

import LanguageSelect from '../../../shared/components/LanguageSelect'
import { useTranslation } from '../../../shared/i18n/useTranslation'
import { useAuthStore } from '../../../stores/authStore'
import { login, type LoginPayload } from '../api/authApi'

function LoginPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)
  const { t } = useTranslation()

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setAuth(data.user, data.token)
      navigate('/')
    },
    onError: () => {
      message.error(t('auth.loginFailed'))
    },
  })

  const handleSubmit = (values: LoginPayload) => {
    loginMutation.mutate(values)
  }

  return (
    <main className="fit-auth-shell">
      <Card className="fit-auth-card">
        <div className="mb-7 flex flex-col gap-4 min-[420px]:flex-row min-[420px]:items-start min-[420px]:justify-between">
          <div className="flex items-center gap-4">
            <div className="fit-brand-mark">
              <ThunderboltOutlined />
            </div>
            <div>
              <Typography.Title level={3} className="fit-title !mb-1">
                {t('auth.loginTitle')}
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
            loading={loginMutation.isPending}
          >
            {t('actions.login')}
          </Button>
        </Form>

        <Typography.Paragraph className="!mt-4 !mb-0">
          {t('auth.registerPrompt')} <Link to="/register">{t('actions.register')}</Link>
        </Typography.Paragraph>
      </Card>
    </main>
  )
}

export default LoginPage
