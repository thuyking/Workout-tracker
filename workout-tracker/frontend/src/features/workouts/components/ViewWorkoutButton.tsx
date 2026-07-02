import { EyeOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { useNavigate } from 'react-router-dom'

import { useWorkoutUiStore } from '../stores/workoutUiStore'

interface ViewWorkoutButtonProps {
  workoutId: string
}

function ViewWorkoutButton({ workoutId }: ViewWorkoutButtonProps) {
  const navigate = useNavigate()
  const openModal = useWorkoutUiStore((state) => state.openModal)

  const handleClick = () => {
    openModal('view')
    navigate(`/workouts/${workoutId}`)
  }

  return (
    <Button type="text" icon={<EyeOutlined />} onClick={handleClick} />
  )
}

export default ViewWorkoutButton
