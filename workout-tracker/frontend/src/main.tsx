import { StrictMode } from 'react'
import { ConfigProvider } from 'antd'
import 'antd/dist/reset.css'
import { QueryClientProvider } from '@tanstack/react-query'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './app/App'
import { queryClient } from './shared/api/queryClient'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#16a34a',
          colorInfo: '#0ea5e9',
          colorSuccess: '#22c55e',
          colorWarning: '#f59e0b',
          colorError: '#ef4444',
          borderRadius: 14,
          controlHeight: 42,
          fontFamily:
            'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        },
        components: {
          Button: {
            borderRadius: 999,
            controlHeight: 42,
            fontWeight: 700,
            primaryShadow: '0 14px 30px rgba(22, 163, 74, 0.28)',
          },
          Card: {
            borderRadiusLG: 28,
          },
          Input: {
            borderRadius: 14,
            controlHeight: 44,
          },
          InputNumber: {
            borderRadius: 14,
            controlHeight: 44,
          },
          Modal: {
            borderRadiusLG: 28,
          },
          Select: {
            borderRadius: 14,
            controlHeight: 44,
          },
          Table: {
            borderRadiusLG: 24,
            headerBg: '#f8fafc',
            headerColor: '#475569',
            rowHoverBg: '#f0fdf4',
          },
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </ConfigProvider>
  </StrictMode>,
)
