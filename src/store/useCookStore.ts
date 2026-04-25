import { create } from 'zustand'
import { cookConnection } from '@/services/websocket/cook'

interface CookState {
  isConnected: boolean
  currentStep: number
  totalSteps: number
  timerRemaining: number
  timerRunning: boolean
  completedSteps: Set<number>
  recipeName: string

  connect: (recipeId: string, recipeName: string, totalSteps: number, stepDurations?: number[]) => void
  disconnect: () => void
  nextStep: () => void
  prevStep: () => void
  startTimer: () => void
  pauseTimer: () => void
  resetTimer: () => void
  completeCook: () => void
  goToStep: (step: number) => void
}

export const useCookStore = create<CookState>((set, get) => ({
  isConnected: false,
  currentStep: 1,
  totalSteps: 0,
  timerRemaining: 0,
  timerRunning: false,
  completedSteps: new Set(),
  recipeName: '',

  connect: (recipeId, recipeName, totalSteps, stepDurations) => {
    set({
      isConnected: true,
      currentStep: 1,
      totalSteps,
      timerRemaining: stepDurations?.[0] || 0,
      timerRunning: false,
      completedSteps: new Set(),
      recipeName,
    })

    cookConnection.connect(recipeId, {
      onStepUpdate: (step, _total) => {
        set({ currentStep: step, totalSteps: _total })
      },
      onTimerTick: (remaining) => {
        set({ timerRemaining: remaining })
      },
      onError: (msg) => {
        Taro.showToast({ title: msg, icon: 'none' })
      },
      onConnected: () => {
        set({ isConnected: true })
      },
      onDisconnected: () => {
        set({ isConnected: false })
      },
    })
  },

  disconnect: () => {
    cookConnection.disconnect()
    set({ isConnected: false, currentStep: 1, timerRunning: false, timerRemaining: 0 })
  },

  nextStep: () => {
    const { currentStep, totalSteps } = get()
    if (currentStep < totalSteps) {
      cookConnection.send({ action: 'next' })
      set({ currentStep: currentStep + 1 })
    }
  },

  prevStep: () => {
    const { currentStep } = get()
    if (currentStep > 1) {
      cookConnection.send({ action: 'prev' })
      set({ currentStep: currentStep - 1 })
    }
  },

  startTimer: () => {
    cookConnection.send({ action: 'timer_start' })
    set({ timerRunning: true })
  },

  pauseTimer: () => {
    cookConnection.send({ action: 'pause' })
    set({ timerRunning: false })
  },

  resetTimer: () => {
    cookConnection.send({ action: 'timer_stop' })
    set({ timerRunning: false, timerRemaining: 0 })
  },

  completeCook: () => {
    cookConnection.disconnect()
    set({ isConnected: false })
  },

  goToStep: (step) => {
    set({ currentStep: step })
  },
}))
