import { CopyOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { useNavigate } from 'react-router-dom'

import { useWorkoutUiStore } from '../stores/workoutUiStore'

interface CopyWorkoutButtonProps {
  workoutId: string
}

function CopyWorkoutButton({ workoutId }: CopyWorkoutButtonProps) {
  const navigate = useNavigate()
  const openModal = useWorkoutUiStore((state) => state.openModal)

  const handleClick = () => {
    openModal('copy')
    navigate(`/workouts/${workoutId}/copy`)
  }

  return (
    <Button type="text" icon={<CopyOutlined />} onClick={handleClick} />
  )
}

export default CopyWorkoutButton
