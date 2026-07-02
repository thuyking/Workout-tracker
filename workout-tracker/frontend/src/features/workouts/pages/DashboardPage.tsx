import {
  DeleteOutlined,
  CalendarOutlined,
  HistoryOutlined,
  LogoutOutlined,
  MenuOutlined,
  FireOutlined,
} from '@ant-design/icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Button,
  Dropdown,
  Popconfirm,
  Space,
  Table,
  Tag,
  Typography,
  type MenuProps,
  type TableProps,
} from 'antd'
import { useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import LanguageSelect from '../../../shared/components/LanguageSelect'
import { useTranslation } from '../../../shared/i18n/useTranslation'
import { useAuthStore } from '../../../stores/authStore'
import { deleteWorkout, getWorkouts, type Workout } from '../api/workoutApi'
import AddWorkoutButton from '../components/AddWorkoutButton'
import CopyWorkoutButton from '../components/CopyWorkoutButton'
import ViewWorkoutButton from '../components/ViewWorkoutButton'
import WorkoutModal from '../components/WorkoutModal'
import { useWorkoutUiStore, type WorkoutModalMode } from '../stores/workoutUiStore'

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

const getModalModeFromPath = (
  pathname: string,
  workoutId?: string,
): WorkoutModalMode | null => {
  if (pathname === '/workouts/new') {
    return 'create'
  }

  if (workoutId && pathname.endsWith('/edit')) {
    return 'edit'
  }

  if (workoutId && pathname.endsWith('/copy')) {
    return 'copy'
  }

  if (workoutId) {
    return 'view'
  }

  return null
}

function DashboardPage() {
  const { id } = useParams()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const logout = useAuthStore((state) => state.logout)
  const user = useAuthStore((state) => state.user)
  const queryClient = useQueryClient()
  const openModal = useWorkoutUiStore((state) => state.openModal)
  const closeModal = useWorkoutUiStore((state) => state.closeModal)
  const { t } = useTranslation()
  const durationUnitLabels = {
    seconds: t('workout.seconds'),
    minutes: t('workout.minutes'),
  }

  const { data: workouts = [], isLoading } = useQuery({
    queryKey: ['workouts'],
    queryFn: getWorkouts,
  })

  const deleteMutation = useMutation({
    mutationFn: deleteWorkout,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['workouts'] }),
  })

  const menuItems: MenuProps['items'] = [
    {
      key: 'today',
      icon: <CalendarOutlined />,
      label: t('actions.todayPlan'),
    },
    {
      key: 'plans',
      icon: <CalendarOutlined />,
      label: t('actions.plans'),
    },
    {
      key: 'history',
      icon: <HistoryOutlined />,
      label: t('actions.history'),
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: t('actions.logout'),
    },
  ]

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'history') {
      navigate('/history')
      return
    }

    if (key === 'plans') {
      navigate('/plans')
      return
    }

    if (key === 'today') {
      navigate('/today')
      return
    }

    if (key === 'logout') {
      logout()
    }
  }

  useEffect(() => {
    const modalMode = getModalModeFromPath(pathname, id)

    if (modalMode) {
      openModal(modalMode)
      return
    }

    closeModal()
  }, [closeModal, id, openModal, pathname])

  const columns: TableProps<Workout>['columns'] = [
    {
      title: t('workout.title'),
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: t('workout.type'),
      dataIndex: 'exerciseType',
      key: 'exerciseType',
      render: (exerciseType) => <Tag color="cyan">{exerciseType}</Tag>,
    },
    {
      title: t('workout.duration'),
      dataIndex: 'duration',
      key: 'duration',
      render: (duration, workout) => (
        formatDuration(duration, workout.durationUnit, durationUnitLabels)
      ),
    },
    {
      title: t('workout.reps'),
      dataIndex: 'reps',
      key: 'reps',
      render: (reps) => reps ?? '-',
    },
    {
      title: t('workout.sets'),
      dataIndex: 'sets',
      key: 'sets',
      render: (sets) => sets ?? '-',
    },
    {
      title: t('workout.calories'),
      dataIndex: 'caloriesBurned',
      key: 'caloriesBurned',
      render: (caloriesBurned) => caloriesBurned ?? '-',
    },
    {
      title: t('workout.workoutDate'),
      dataIndex: 'workoutDate',
      key: 'workoutDate',
      render: (workoutDate) => workoutDate.slice(0, 10),
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right',
      render: (_, workout) => (
        <Space>
          <ViewWorkoutButton workoutId={workout._id} />
          <AddWorkoutButton workoutId={workout._id} />
          <CopyWorkoutButton workoutId={workout._id} />
          <Popconfirm
            title={t('workout.deleteConfirm')}
            cancelText={t('actions.cancel')}
            onConfirm={() => deleteMutation.mutate(workout._id)}
          >
            <Button danger type="text" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <main className="fit-app-shell">
      <section className="fit-page">
        <div className="fit-hero flex-col sm:flex-row">
          <div className="flex items-center gap-4">
            <div className="fit-brand-mark">
              <FireOutlined />
            </div>
            <div>
              <Typography.Title level={2} className="fit-title">
                {t('dashboard.title')}
              </Typography.Title>
              <Typography.Text className="fit-subtitle">
                {user
                  ? t('dashboard.greeting', { name: user.name })
                  : t('dashboard.subtitle')}
              </Typography.Text>
            </div>
          </div>

          <div className="fit-actions">
            <AddWorkoutButton />
            <Dropdown
              menu={{
                items: menuItems,
                onClick: handleMenuClick,
              }}
              trigger={['click']}
            >
              <Button icon={<MenuOutlined />}>{t('actions.menu')}</Button>
            </Dropdown>
            <LanguageSelect />
          </div>
        </div>

        <div className="fit-panel fit-table-wrap">
          <Table
            columns={columns}
            dataSource={workouts}
            loading={isLoading}
            pagination={{ pageSize: 8 }}
            rowKey="_id"
            scroll={{ x: 920 }}
          />
        </div>
      </section>

      <WorkoutModal />
    </main>
  )
}

export default DashboardPage
