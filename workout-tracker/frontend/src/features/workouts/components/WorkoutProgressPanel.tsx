import { RiseOutlined, FallOutlined, MinusOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { Alert, Empty, Segmented, Spin, Tag, Typography } from 'antd'
import { useState } from 'react'

import { useTranslation } from '../../../shared/i18n/useTranslation'
import {
  getWorkoutProgress,
  type WorkoutMetricProgress,
  type WorkoutProgressRange,
} from '../api/workoutApi'

interface WorkoutProgressPanelProps {
  workoutId: string
}

const formatNumber = (value: number | null) => {
  if (value === null) {
    return '-'
  }

  return Number.isInteger(value) ? value.toString() : value.toFixed(2)
}

const formatPercent = (value: number | null) => {
  if (value === null) {
    return '-'
  }

  return `${formatNumber(value)}%`
}

const getUnitLabel = (
  unit: WorkoutMetricProgress['unit'],
  t: (key: string) => string,
) => {
  if (unit === 'total reps') {
    return t('progress.totalReps')
  }

  return unit === 'seconds' ? t('workout.seconds') : t('workout.minutes')
}

const getDirectionView = (
  direction: WorkoutMetricProgress['direction'],
  t: (key: string) => string,
) => {
  if (direction === 'increase') {
    return {
      color: 'green',
      icon: <RiseOutlined />,
      label: t('progress.increase'),
    }
  }

  if (direction === 'decrease') {
    return {
      color: 'red',
      icon: <FallOutlined />,
      label: t('progress.decrease'),
    }
  }

  if (direction === 'stable') {
    return {
      color: 'default',
      icon: <MinusOutlined />,
      label: t('progress.stable'),
    }
  }

  return {
    color: 'orange',
    icon: <MinusOutlined />,
    label: t('progress.notEnoughData'),
  }
}

interface MetricProgressBlockProps {
  title: string
  emptyDescription: string
  progress: WorkoutMetricProgress
}

function MetricProgressBlock({
  title,
  emptyDescription,
  progress,
}: MetricProgressBlockProps) {
  const { t } = useTranslation()
  const directionView = getDirectionView(progress.direction, t)
  const unitLabel = getUnitLabel(progress.unit, t)

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <Typography.Text strong>{title}</Typography.Text>
        <div className="flex flex-wrap items-center gap-2">
          <Tag color={directionView.color} icon={directionView.icon}>
            {directionView.label}
          </Tag>
          <Typography.Text type="secondary">
            {t('progress.entriesCount', { count: progress.entriesCount })}
          </Typography.Text>
        </div>
      </div>

      {progress.direction !== 'not_enough_data' ? (
        <div className="space-y-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="fit-metric">
              <Typography.Text type="secondary">{t('progress.firstValue')}</Typography.Text>
              <div className="text-base font-semibold">
                {formatNumber(progress.firstValue)} {unitLabel}
              </div>
            </div>

            <div className="fit-metric">
              <Typography.Text type="secondary">{t('progress.lastValue')}</Typography.Text>
              <div className="text-base font-semibold">
                {formatNumber(progress.lastValue)} {unitLabel}
              </div>
            </div>

            <div className="fit-metric">
              <Typography.Text type="secondary">{t('progress.change')}</Typography.Text>
              <div className="text-base font-semibold">
                {formatNumber(progress.absoluteChange)} {unitLabel}
              </div>
            </div>

            <div className="fit-metric">
              <Typography.Text type="secondary">{t('progress.totalPercent')}</Typography.Text>
              <div className="text-base font-semibold">
                {formatPercent(progress.percentChange)}
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-slate-50 p-4">
            <Typography.Text>
              {t('progress.averagePerEntry')}{' '}
              <strong>
                {formatNumber(progress.averageChangePerEntry)} {unitLabel}
              </strong>
              {' | '}
              {t('progress.averagePercentPerEntry')}{' '}
              <strong>{formatPercent(progress.averagePercentChangePerEntry)}</strong>
            </Typography.Text>
          </div>
        </div>
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={emptyDescription}
        />
      )}
    </div>
  )
}

function WorkoutProgressPanel({ workoutId }: WorkoutProgressPanelProps) {
  const [range, setRange] = useState<WorkoutProgressRange>('7d')
  const { t } = useTranslation()
  const rangeOptions: { label: string; value: WorkoutProgressRange }[] = [
    { label: t('progress.sevenDays'), value: '7d' },
    { label: t('progress.oneMonth'), value: '1m' },
    { label: t('progress.oneYear'), value: '1y' },
  ]

  const { data: progress, isLoading, isError } = useQuery({
    queryKey: ['workout-progress', workoutId, range],
    queryFn: () => getWorkoutProgress(workoutId, range),
  })

  return (
    <section className="mt-6 border-t border-slate-100 pt-5">
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Typography.Title level={5} className="fit-title !mb-0">
            {t('progress.title')}
          </Typography.Title>
          <Typography.Text type="secondary">
            {t('progress.description')}
          </Typography.Text>
        </div>

        <Segmented
          options={rangeOptions}
          value={range}
          onChange={(value) => setRange(value as WorkoutProgressRange)}
        />
      </div>

      {isLoading ? (
        <div className="flex min-h-24 items-center justify-center">
          <Spin />
        </div>
      ) : isError ? (
        <Alert
          type="error"
          message={t('progress.loadError')}
          showIcon
        />
      ) : progress ? (
        <div className="space-y-3">
          <MetricProgressBlock
            title={t('workout.durationSets')}
            emptyDescription={t('progress.durationEmpty')}
            progress={progress.durationProgress}
          />
          <MetricProgressBlock
            title={t('progress.volumeTitle')}
            emptyDescription={t('progress.volumeEmpty')}
            progress={progress.volumeProgress}
          />
        </div>
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={t('progress.durationEmpty')}
        />
      )}
    </section>
  )
}

export default WorkoutProgressPanel
