import { ArrowLeftOutlined, CalendarOutlined } from '@ant-design/icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button, Empty, Select, Space, Spin, Typography } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import LanguageSelect from '../../../shared/components/LanguageSelect'
import { useTranslation } from '../../../shared/i18n/useTranslation'
import {
  getWorkoutPlans,
  toggleWorkoutPlanExercise,
  type WorkoutPlan,
} from '../api/workoutPlanApi'
import WorkoutPlanExerciseChecklist from '../components/WorkoutPlanExerciseChecklist'

const getTodayKey = () => {
  const date = new Date()
  const timezoneOffset = date.getTimezoneOffset() * 60000

  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 10)
}

function TodayPlanPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { t } = useTranslation()
  const todayKey = getTodayKey()
  const [selectedPlanId, setSelectedPlanId] = useState<string>()

  const { data: plans = [], isLoading } = useQuery({
    queryKey: ['workout-plans', todayKey],
    queryFn: () => getWorkoutPlans(todayKey),
  })

  useEffect(() => {
    if (!selectedPlanId && plans.length > 0) {
      setSelectedPlanId(plans[0]._id)
    }
  }, [plans, selectedPlanId])

  const selectedPlan = useMemo<WorkoutPlan | undefined>(() => (
    plans.find((plan) => plan._id === selectedPlanId)
  ), [plans, selectedPlanId])

  const toggleMutation = useMutation({
    mutationFn: ({
      exerciseId,
      planId,
    }: {
      exerciseId: string
      planId: string
    }) => toggleWorkoutPlanExercise(planId, exerciseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workout-plans'] })
      queryClient.invalidateQueries({ queryKey: ['workout-plans', todayKey] })
      queryClient.invalidateQueries({ queryKey: ['workouts'] })
    },
  })

  return (
    <main className="fit-app-shell">
      <section className="fit-page fit-page-narrow">
        <div className="fit-hero flex-col sm:flex-row">
          <div className="flex items-center gap-4">
            <div className="fit-brand-mark">
              <CalendarOutlined />
            </div>
            <div>
              <Typography.Title level={2} className="fit-title">
                {t('plans.todayTitle')}
              </Typography.Title>
              <Typography.Text className="fit-subtitle">
                {t('plans.todaySubtitle')}
              </Typography.Text>
            </div>
          </div>

          <div className="fit-actions">
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/')}>
              {t('actions.dashboard')}
            </Button>
            <Button icon={<CalendarOutlined />} onClick={() => navigate('/plans')}>
              {t('actions.plans')}
            </Button>
            <LanguageSelect />
          </div>
        </div>

        {isLoading ? (
          <div className="fit-panel fit-loading">
            <Spin />
          </div>
        ) : plans.length > 0 ? (
          <div className="space-y-5">
            <Select
              value={selectedPlanId}
              className="w-full sm:w-96"
              options={plans.map((plan) => ({
                value: plan._id,
                label: plan.name,
              }))}
              placeholder={t('plans.selectTodayPlan')}
              onChange={setSelectedPlanId}
            />

            {selectedPlan ? (
              <WorkoutPlanExerciseChecklist
                isUpdating={toggleMutation.isPending}
                plan={selectedPlan}
                onToggle={(exerciseId) => {
                  toggleMutation.mutate({
                    exerciseId,
                    planId: selectedPlan._id,
                  })
                }}
              />
            ) : null}
          </div>
        ) : (
          <div className="fit-panel fit-empty">
            <Empty description={t('plans.noTodayPlans')} />
          </div>
        )}
      </section>
    </main>
  )
}

export default TodayPlanPage
