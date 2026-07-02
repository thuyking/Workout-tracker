import { CopyOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { Button, Popconfirm, Space, Tag, Typography } from 'antd'

import { useTranslation } from '../../../shared/i18n/useTranslation'
import type { WorkoutPlan } from '../api/workoutPlanApi'

interface WorkoutPlanCardProps {
  plan: WorkoutPlan
  onDelete: (planId: string) => void
  onEdit: (plan: WorkoutPlan) => void
  onCopy: (plan: WorkoutPlan) => void
}

const getCompletedCount = (plan: WorkoutPlan) => {
  return plan.exercises.filter((exercise) => exercise.isCompleted).length
}

function WorkoutPlanCard({
  plan,
  onCopy,
  onDelete,
  onEdit,
}: WorkoutPlanCardProps) {
  const { t } = useTranslation()
  const completedCount = getCompletedCount(plan)

  return (
    <div className="fit-card">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Typography.Title level={5} className="fit-title !mb-1">
            {plan.name}
          </Typography.Title>
          <Typography.Text type="secondary">
            {plan.planDate.slice(0, 10)}
          </Typography.Text>
          <div className="mt-2">
            <Tag color={completedCount === plan.exercises.length ? 'green' : 'cyan'}>
              {t('plans.progress', {
                completed: completedCount,
                total: plan.exercises.length,
              })}
            </Tag>
          </div>
        </div>

        <Space className="self-end sm:self-start">
          <Button type="text" icon={<EditOutlined />} onClick={() => onEdit(plan)} />
          <Button type="text" icon={<CopyOutlined />} onClick={() => onCopy(plan)} />
          <Popconfirm
            title={t('plans.deleteConfirm')}
            cancelText={t('actions.cancel')}
            onConfirm={() => onDelete(plan._id)}
          >
            <Button danger type="text" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      </div>

      <div className="mt-4 space-y-2">
        {plan.exercises.map((exercise) => (
          <div
            key={exercise._id}
            className="flex flex-wrap items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2 text-sm text-slate-600"
          >
            <Typography.Text strong>{exercise.name}</Typography.Text>
            <Tag>{t('workout.reps')}: {exercise.reps ?? '-'}</Tag>
            <Tag>{t('workout.sets')}: {exercise.sets ?? '-'}</Tag>
            <Tag>{t('plans.holdSeconds')}: {exercise.holdSeconds ?? '-'}</Tag>
          </div>
        ))}
      </div>
    </div>
  )
}

export default WorkoutPlanCard
