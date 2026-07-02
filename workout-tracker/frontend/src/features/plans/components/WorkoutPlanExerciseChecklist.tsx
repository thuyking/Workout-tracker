import { Checkbox, Tag, Typography } from 'antd'

import { useTranslation } from '../../../shared/i18n/useTranslation'
import type { WorkoutPlan } from '../api/workoutPlanApi'

interface WorkoutPlanExerciseChecklistProps {
  isUpdating: boolean
  plan: WorkoutPlan
  onToggle: (exerciseId: string) => void
}

function WorkoutPlanExerciseChecklist({
  isUpdating,
  plan,
  onToggle,
}: WorkoutPlanExerciseChecklistProps) {
  const { t } = useTranslation()
  const completedCount = plan.exercises.filter((exercise) => exercise.isCompleted).length

  return (
    <div className="fit-card">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Typography.Title level={4} className="fit-title !mb-1">
            {plan.name}
          </Typography.Title>
          <Typography.Text type="secondary">
            {plan.planDate.slice(0, 10)}
          </Typography.Text>
        </div>

        <Tag color={completedCount === plan.exercises.length ? 'green' : 'blue'}>
          {t('plans.progress', {
            completed: completedCount,
            total: plan.exercises.length,
          })}
        </Tag>
      </div>

      <div className="space-y-3">
        {plan.exercises.map((exercise) => (
          <div
            key={exercise._id}
            className="flex flex-col gap-3 rounded-3xl bg-slate-50 p-4 transition hover:bg-green-50 sm:flex-row sm:items-center sm:justify-between"
          >
            <Checkbox
              checked={exercise.isCompleted}
              disabled={isUpdating}
              onChange={() => onToggle(exercise._id)}
            >
              <Typography.Text delete={exercise.isCompleted}>
                {exercise.name}
              </Typography.Text>
            </Checkbox>

            <div className="flex flex-wrap gap-2">
              <Tag>{t('workout.reps')}: {exercise.reps ?? '-'}</Tag>
              <Tag>{t('workout.sets')}: {exercise.sets ?? '-'}</Tag>
              <Tag>{t('plans.holdSeconds')}: {exercise.holdSeconds ?? '-'}</Tag>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default WorkoutPlanExerciseChecklist
