import { create } from 'zustand'

export type WorkoutModalMode = 'create' | 'view' | 'edit' | 'copy'

interface WorkoutUiState {
  isModalOpen: boolean
  modalMode: WorkoutModalMode
  openModal: (modalMode: WorkoutModalMode) => void
  closeModal: () => void
}

export const useWorkoutUiStore = create<WorkoutUiState>((set) => ({
  isModalOpen: false,
  modalMode: 'create',
  openModal: (modalMode) => set({ isModalOpen: true, modalMode }),
  closeModal: () => set({ isModalOpen: false }),
}))
