import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Form, Input, InputNumber, Modal, Typography } from 'antd'
import { useEffect } from 'react'

import { useTranslation } from '../../../shared/i18n/useTranslation'
import type { WorkoutPlan, WorkoutPlanPayload } from '../api/workoutPlanApi'

interface WorkoutPlanFormProps {
  initialPlan?: WorkoutPlan | null
  isCopyMode?: boolean
  isOpen: boolean
  isSubmitting: boolean
  onClose: () => void
  onSubmit: (payload: WorkoutPlanPayload) => Promise<void>
}

const getDateInputValue = (date = new Date()) => {
  const timezoneOffset = date.getTimezoneOffset() * 60000
  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 10)
}

const getInitialValues = (plan?: WorkoutPlan | null): WorkoutPlanPayload => ({
  name: plan?.name ?? '',
  planDate: plan?.planDate.slice(0, 10) ?? getDateInputValue(),
  exercises: plan?.exercises.map((exercise) => ({
    name: exercise.name,
    reps: exercise.reps,
    sets: exercise.sets,
    holdSeconds: exercise.holdSeconds,
    isCompleted: exercise.isCompleted,
  })) ?? [
    {
      name: '',
      reps: undefined,
      sets: undefined,
      holdSeconds: undefined,
      isCompleted: false,
    },
  ],
})

function WorkoutPlanForm({
  initialPlan,
  isCopyMode = false,
  isOpen,
  isSubmitting,
  onClose,
  onSubmit,
}: WorkoutPlanFormProps) {
  const [form] = Form.useForm<WorkoutPlanPayload>()
  const { t } = useTranslation()

  useEffect(() => {
    if (!isOpen) {
      return
    }

    form.setFieldsValue(getInitialValues(initialPlan))
  }, [form, initialPlan, isOpen])

  const handleSubmit = async () => {
    const values = await form.validateFields()
    await onSubmit({
      ...values,
      exercises: values.exercises.map((exercise, index) => ({
        ...exercise,
        isCompleted: isCopyMode
          ? false
          : initialPlan?.exercises[index]?.isCompleted ?? exercise.isCompleted ?? false,
        workoutLog: isCopyMode
          ? undefined
          : initialPlan?.exercises[index]?.workoutLog ?? exercise.workoutLog,
      })),
    })
    form.resetFields()
  }

  return (
    <Modal
      title={initialPlan && !isCopyMode ? t('plans.editPlan') : t('plans.createPlan')}
      open={isOpen}
      okText={t('actions.save')}
      cancelText={t('actions.cancel')}
      confirmLoading={isSubmitting}
      onCancel={onClose}
      onOk={handleSubmit}
      destroyOnHidden
      width={760}
    >
      <Form
        form={form}
        layout="vertical"
        size="large"
        initialValues={getInitialValues(initialPlan)}
      >
        <div className="fit-responsive-form-grid">
          <Form.Item
            label={t('plans.planName')}
            name="name"
            rules={[{ required: true, message: t('plans.planNameRequired') }]}
          >
            <Input placeholder={t('plans.planNamePlaceholder')} />
          </Form.Item>

          <Form.Item
            label={t('plans.planDate')}
            name="planDate"
            rules={[{ required: true, message: t('plans.planDateRequired') }]}
          >
            <Input type="date" />
          </Form.Item>
        </div>

        <Typography.Text strong className="text-slate-800">
          {t('plans.exercises')}
        </Typography.Text>

        <Form.List name="exercises">
          {(fields, { add, remove }) => (
            <div className="mt-3 space-y-3">
              {fields.map((field) => (
                <div
                  key={field.key}
                  className="fit-exercise-row"
                >
                  <Form.Item
                    {...field}
                    label={t('plans.exerciseName')}
                    name={[field.name, 'name']}
                    rules={[{ required: true, message: t('plans.exerciseNameRequired') }]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    {...field}
                    label={t('workout.reps')}
                    name={[field.name, 'reps']}
                  >
                    <InputNumber className="w-full" min={0} />
                  </Form.Item>

                  <Form.Item
                    {...field}
                    label={t('workout.sets')}
                    name={[field.name, 'sets']}
                  >
                    <InputNumber className="w-full" min={0} />
                  </Form.Item>

                  <Form.Item
                    {...field}
                    label={t('plans.holdSeconds')}
                    name={[field.name, 'holdSeconds']}
                  >
                    <InputNumber className="w-full" min={0} />
                  </Form.Item>

                  <Form.Item label=" " className="mb-0">
                    <Button
                      danger
                      type="text"
                      icon={<DeleteOutlined />}
                      disabled={fields.length === 1}
                      onClick={() => remove(field.name)}
                    />
                  </Form.Item>
                </div>
              ))}

              <Button
                icon={<PlusOutlined />}
                onClick={() => add({ isCompleted: false })}
              >
                {t('plans.addExercise')}
              </Button>
            </div>
          )}
        </Form.List>
      </Form>
    </Modal>
  )
}

export default WorkoutPlanForm
