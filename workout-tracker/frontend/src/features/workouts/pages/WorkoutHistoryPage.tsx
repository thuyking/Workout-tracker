import { ArrowLeftOutlined, HistoryOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import {
  Button,
  Collapse,
  Empty,
  Space,
  Spin,
  Tag,
  Typography,
  type CollapseProps,
} from 'antd'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import LanguageSelect from '../../../shared/components/LanguageSelect'
import { useTranslation } from '../../../shared/i18n/useTranslation'
import { getWorkouts, type Workout } from '../api/workoutApi'

type WorkoutHistoryItems = NonNullable<CollapseProps['items']>

const formatDuration = (
  duration: number | undefined,
  durationUnit: Workout['durationUnit'] | undefined,
  unitLabels: Record<NonNullable<Workout['durationUnit']>, string>,
) => {
  if (!duration) {
    return '-'
  }

  const unitLabel = durationUnit === 'seconds' ? unitLabels.seconds : unitLabels.minutes

  return `${duration} ${unitLabel}`
}

const getWorkoutDateKey = (workoutDate: string) => workoutDate.slice(0, 10)

const formatWorkoutDate = (dateKey: string, language: string) => {
  const date = new Date(`${dateKey}T00:00:00`)

  return date.toLocaleDateString(language === 'en' ? 'en-US' : 'vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

const getDailyCalories = (workouts: Workout[]) => {
  const total = workouts.reduce(
    (sum, workout) => sum + (workout.caloriesBurned ?? 0),
    0,
  )

  return total > 0 ? total : null
}

function WorkoutHistoryPage() {
  const navigate = useNavigate()
  const { language, t } = useTranslation()
  const durationUnitLabels = useMemo(
    () => ({
      seconds: t('workout.seconds'),
      minutes: t('workout.minutes'),
    }),
    [t],
  )
  const { data: workouts = [], isLoading } = useQuery({
    queryKey: ['workouts'],
    queryFn: getWorkouts,
  })

  const workoutHistoryItems = useMemo<WorkoutHistoryItems>(() => {
    const historyByDate = workouts.reduce<Record<string, Workout[]>>(
      (groups, workout) => {
        const dateKey = getWorkoutDateKey(workout.workoutDate)
        groups[dateKey] = [...(groups[dateKey] ?? []), workout]
        return groups
      },
      {},
    )

    return Object.entries(historyByDate).map(([dateKey, dailyWorkouts]) => {
      const calories = getDailyCalories(dailyWorkouts)

      return {
        key: dateKey,
        label: (
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <Typography.Text strong>{formatWorkoutDate(dateKey, language)}</Typography.Text>
            <Typography.Text type="secondary">
              {t('history.workoutCount', { count: dailyWorkouts.length })}
              {calories ? ` | ${t('history.caloriesSuffix', { count: calories })}` : ''}
            </Typography.Text>
          </div>
        ),
        children: (
          <div className="space-y-3">
            {dailyWorkouts.map((workout) => (
              <div
                key={workout._id}
                className="rounded-2xl bg-slate-50 p-4 transition hover:bg-green-50 sm:flex sm:items-start sm:justify-between"
              >
                <div>
                  <Typography.Text strong>{workout.title}</Typography.Text>
                  <div className="mt-1 flex flex-wrap gap-2">
                    <Tag color="cyan">{workout.exerciseType}</Tag>
                    <Tag>
                      {formatDuration(
                        workout.duration,
                        workout.durationUnit,
                        durationUnitLabels,
                      )}
                    </Tag>
                    <Tag>{t('workout.reps')}: {workout.reps ?? '-'}</Tag>
                    <Tag>{t('workout.sets')}: {workout.sets ?? '-'}</Tag>
                  </div>
                  {workout.notes ? (
                    <Typography.Paragraph type="secondary" className="!mt-2 !mb-0">
                      {workout.notes}
                    </Typography.Paragraph>
                  ) : null}
                </div>

                <Typography.Text type="secondary">
                  {workout.caloriesBurned
                    ? t('history.caloriesSuffix', { count: workout.caloriesBurned })
                    : '-'}
                </Typography.Text>
              </div>
            ))}
          </div>
        ),
      }
    })
  }, [durationUnitLabels, language, t, workouts])

  return (
    <main className="fit-app-shell">
      <section className="fit-page">
        <div className="fit-hero flex-col sm:flex-row">
          <div className="flex items-center gap-4">
            <div className="fit-brand-mark">
              <HistoryOutlined />
            </div>
            <div>
              <Typography.Title level={2} className="fit-title">
                {t('history.title')}
              </Typography.Title>
              <Typography.Text className="fit-subtitle">
                {t('history.subtitle')}
              </Typography.Text>
            </div>
          </div>

          <div className="fit-actions">
            <LanguageSelect />
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/')}>
              {t('actions.dashboard')}
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="fit-panel fit-loading">
            <Spin />
          </div>
        ) : workoutHistoryItems.length > 0 ? (
          <Collapse
            items={workoutHistoryItems}
            defaultActiveKey={[workoutHistoryItems[0].key as string]}
          />
        ) : (
          <div className="fit-panel fit-empty">
            <Empty description={t('history.empty')} />
          </div>
        )}
      </section>
    </main>
  )
}

export default WorkoutHistoryPage
