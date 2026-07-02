import { ArrowLeftOutlined, CalendarOutlined, PlusOutlined } from '@ant-design/icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button, Empty, Space, Spin, Typography } from 'antd'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import LanguageSelect from '../../../shared/components/LanguageSelect'
import { useTranslation } from '../../../shared/i18n/useTranslation'
import {
  createWorkoutPlan,
  deleteWorkoutPlan,
  getWorkoutPlans,
  updateWorkoutPlan,
  type WorkoutPlan,
  type WorkoutPlanPayload,
} from '../api/workoutPlanApi'
import WorkoutPlanCard from '../components/WorkoutPlanCard'
import WorkoutPlanForm from '../components/WorkoutPlanForm'

function WorkoutPlansPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { t } = useTranslation()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState<WorkoutPlan | null>(null)
  const [copyingPlan, setCopyingPlan] = useState<WorkoutPlan | null>(null)

  const { data: plans = [], isLoading } = useQuery({
    queryKey: ['workout-plans'],
    queryFn: () => getWorkoutPlans(),
  })

  const createMutation = useMutation({
    mutationFn: createWorkoutPlan,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['workout-plans'] }),
  })

  const updateMutation = useMutation({
    mutationFn: (payload: WorkoutPlanPayload) => (
      updateWorkoutPlan(editingPlan?._id as string, payload)
    ),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['workout-plans'] }),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteWorkoutPlan,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['workout-plans'] }),
  })

  const closeForm = () => {
    setIsFormOpen(false)
    setEditingPlan(null)
    setCopyingPlan(null)
  }

  const handleCreateClick = () => {
    setEditingPlan(null)
    setCopyingPlan(null)
    setIsFormOpen(true)
  }

  const handleSubmit = async (payload: WorkoutPlanPayload) => {
    if (editingPlan) {
      await updateMutation.mutateAsync(payload)
    } else {
      await createMutation.mutateAsync(payload)
    }

    closeForm()
  }

  return (
    <main className="fit-app-shell">
      <section className="fit-page">
        <div className="fit-hero flex-col sm:flex-row">
          <div className="flex items-center gap-4">
            <div className="fit-brand-mark">
              <CalendarOutlined />
            </div>
            <div>
              <Typography.Title level={2} className="fit-title">
                {t('plans.title')}
              </Typography.Title>
              <Typography.Text className="fit-subtitle">
                {t('plans.subtitle')}
              </Typography.Text>
            </div>
          </div>

          <div className="fit-actions">
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/')}>
              {t('actions.dashboard')}
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateClick}>
              {t('plans.createPlan')}
            </Button>
            <LanguageSelect />
          </div>
        </div>

        {isLoading ? (
          <div className="fit-panel fit-loading">
            <Spin />
          </div>
        ) : plans.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {plans.map((plan) => (
              <WorkoutPlanCard
                key={plan._id}
                plan={plan}
                onCopy={(planToCopy) => {
                  setEditingPlan(null)
                  setCopyingPlan(planToCopy)
                  setIsFormOpen(true)
                }}
                onDelete={(planId) => deleteMutation.mutate(planId)}
                onEdit={(planToEdit) => {
                  setCopyingPlan(null)
                  setEditingPlan(planToEdit)
                  setIsFormOpen(true)
                }}
              />
            ))}
          </div>
        ) : (
          <div className="fit-panel fit-empty">
            <Empty description={t('plans.noPlans')} />
          </div>
        )}
      </section>

      <WorkoutPlanForm
        initialPlan={editingPlan ?? copyingPlan}
        isCopyMode={Boolean(copyingPlan)}
        isOpen={isFormOpen}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        onClose={closeForm}
        onSubmit={handleSubmit}
      />
    </main>
  )
}

export default WorkoutPlansPage
