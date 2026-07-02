import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Form, Input, InputNumber, Modal, Select } from 'antd'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { useTranslation } from '../../../shared/i18n/useTranslation'
import {
  createWorkout,
  getWorkout,
  updateWorkout,
  type WorkoutPayload,
} from '../api/workoutApi'
import { useWorkoutUiStore } from '../stores/workoutUiStore'
import WorkoutProgressPanel from './WorkoutProgressPanel'

function WorkoutModal() {
  const [form] = Form.useForm<WorkoutPayload>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { id } = useParams()
  const isModalOpen = useWorkoutUiStore((state) => state.isModalOpen)
  const modalMode = useWorkoutUiStore((state) => state.modalMode)
  const closeModalStore = useWorkoutUiStore((state) => state.closeModal)
  const isViewMode = modalMode === 'view'
  const isCopyMode = modalMode === 'copy'
  const { t } = useTranslation()

  const { data: workout } = useQuery({
    queryKey: ['workout', id],
    queryFn: () => getWorkout(id as string),
    enabled: Boolean(id) && isModalOpen,
  })

  const createMutation = useMutation({
    mutationFn: createWorkout,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['workouts'] }),
  })

  const updateMutation = useMutation({
    mutationFn: (payload: WorkoutPayload) => updateWorkout(id as string, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workouts'] })
      queryClient.invalidateQueries({ queryKey: ['workout', id] })
    },
  })

  useEffect(() => {
    if (!workout) {
      form.resetFields()
      return
    }

    form.setFieldsValue({
      title: workout.title,
      exerciseType: workout.exerciseType,
      duration: workout.duration,
      durationUnit: workout.durationUnit ?? 'minutes',
      reps: workout.reps,
      sets: workout.sets,
      caloriesBurned: workout.caloriesBurned,
      workoutDate: isCopyMode
        ? new Date().toISOString().slice(0, 10)
        : workout.workoutDate.slice(0, 10),
      notes: workout.notes,
    })
  }, [form, isCopyMode, workout])

  const closeModal = () => {
    closeModalStore()
    form.resetFields()
    navigate('/')
  }

  const handleSubmit = async () => {
    const values = await form.validateFields()

    if (modalMode === 'create' || modalMode === 'copy') {
      await createMutation.mutateAsync(values)
    }

    if (modalMode === 'edit') {
      await updateMutation.mutateAsync(values)
    }

    closeModal()
  }

  return (
    <Modal
      title={
        modalMode === 'create'
          ? t('workout.addTitle')
          : modalMode === 'copy'
            ? t('workout.copyTitle')
          : modalMode === 'edit'
            ? t('workout.editTitle')
            : t('workout.detailTitle')
      }
      open={isModalOpen}
      okText={isViewMode ? t('actions.close') : t('actions.save')}
      cancelText={t('actions.cancel')}
      confirmLoading={createMutation.isPending || updateMutation.isPending}
      onCancel={closeModal}
      onOk={isViewMode ? closeModal : handleSubmit}
      cancelButtonProps={{ hidden: isViewMode }}
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        size="large"
        disabled={isViewMode}
        initialValues={{ durationUnit: 'minutes' }}
      >
        <Form.Item
          label={t('workout.title')}
          name="title"
          rules={[{ required: true, message: t('workout.titleRequired') }]}
        >
          <Input placeholder={t('workout.titlePlaceholder')} />
        </Form.Item>

        <Form.Item
          label={t('workout.type')}
          name="exerciseType"
          rules={[{ required: true, message: t('workout.typeRequired') }]}
        >
          <Input placeholder={t('workout.typePlaceholder')} />
        </Form.Item>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_170px]">
          <Form.Item
            label={t('workout.duration')}
            name="duration"
          >
            <InputNumber className="w-full" min={1} />
          </Form.Item>

          <Form.Item
            label={t('workout.durationUnit')}
            name="durationUnit"
          >
            <Select
              options={[
                { value: 'seconds', label: t('workout.seconds') },
                { value: 'minutes', label: t('workout.minutes') },
              ]}
            />
          </Form.Item>
        </div>

        <div className="fit-responsive-form-grid">
          <Form.Item label={t('workout.reps')} name="reps">
            <InputNumber className="w-full" min={0} />
          </Form.Item>

          <Form.Item label={t('workout.sets')} name="sets">
            <InputNumber className="w-full" min={0} />
          </Form.Item>
        </div>

        <Form.Item label={t('workout.calories')} name="caloriesBurned">
          <InputNumber className="w-full" min={0} />
        </Form.Item>

        <Form.Item
          label={t('workout.workoutDate')}
          name="workoutDate"
          rules={[{ required: true, message: t('workout.workoutDateRequired') }]}
        >
          <Input type="date" />
        </Form.Item>

        <Form.Item label={t('workout.notes')} name="notes">
          <Input.TextArea rows={3} placeholder={t('workout.notesPlaceholder')} />
        </Form.Item>
      </Form>

      {isViewMode && id ? <WorkoutProgressPanel workoutId={id} /> : null}
    </Modal>
  )
}

export default WorkoutModal
