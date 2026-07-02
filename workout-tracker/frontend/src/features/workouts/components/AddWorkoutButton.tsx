import { EditOutlined, PlusOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { useNavigate } from 'react-router-dom'

import { useTranslation } from '../../../shared/i18n/useTranslation'
import { useWorkoutUiStore } from '../stores/workoutUiStore'

interface AddWorkoutButtonProps {
  workoutId?: string
}

function AddWorkoutButton({ workoutId }: AddWorkoutButtonProps) {
  const navigate = useNavigate()
  const openModal = useWorkoutUiStore((state) => state.openModal)
  const isEdit = Boolean(workoutId)
  const { t } = useTranslation()

  const handleClick = () => {
    openModal(isEdit ? 'edit' : 'create')
    navigate(isEdit ? `/workouts/${workoutId}/edit` : '/workouts/new')
  }

  return (
    <Button
      type={isEdit ? 'text' : 'primary'}
      icon={isEdit ? <EditOutlined /> : <PlusOutlined />}
      onClick={handleClick}
    >
      {isEdit ? null : t('actions.addWorkout')}
    </Button>
  )
}

export default AddWorkoutButton
