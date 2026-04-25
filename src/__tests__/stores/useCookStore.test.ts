import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useCookStore } from '@/store/useCookStore'
import { cookConnection } from '@/services/websocket/cook'

vi.mock('@/services/websocket/cook', () => ({
  cookConnection: {
    connect: vi.fn(),
    disconnect: vi.fn(),
    send: vi.fn(),
  },
}))

describe('useCookStore', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useCookStore.setState({
      isConnected: false,
      currentStep: 1,
      totalSteps: 0,
      timerRemaining: 0,
      timerRunning: false,
      recipeName: '',
      steps: [],
    })
  })

  it('initializes with default state', () => {
    const state = useCookStore.getState()
    expect(state.isConnected).toBe(false)
    expect(state.currentStep).toBe(1)
    expect(state.totalSteps).toBe(0)
    expect(state.timerRunning).toBe(false)
  })

  it('connects and initializes state', () => {
    const state = useCookStore.getState()
    const steps = [
      { description: 'Step 1', duration: 30 },
      { description: 'Step 2', duration: 60 },
    ]
    state.connect('recipe-1', 'Test Recipe', 2, steps)

    const newState = useCookStore.getState()
    expect(newState.isConnected).toBe(true)
    expect(newState.recipeName).toBe('Test Recipe')
    expect(newState.totalSteps).toBe(2)
    expect(newState.steps).toEqual(steps)
    expect(cookConnection.connect).toHaveBeenCalled()
  })

  it('disconnects and resets state', () => {
    const state = useCookStore.getState()
    state.connect('recipe-1', 'Test', 5)
    state.disconnect()

    const newState = useCookStore.getState()
    expect(newState.isConnected).toBe(false)
    expect(newState.currentStep).toBe(1)
    expect(cookConnection.disconnect).toHaveBeenCalled()
  })

  it('goes to next step', () => {
    const state = useCookStore.getState()
    state.connect('recipe-1', 'Test', 5)
    state.nextStep()

    expect(useCookStore.getState().currentStep).toBe(2)
    expect(cookConnection.send).toHaveBeenCalledWith({ action: 'next' })
  })

  it('does not go past last step', () => {
    const state = useCookStore.getState()
    state.connect('recipe-1', 'Test', 2)
    state.nextStep()
    state.nextStep()

    expect(useCookStore.getState().currentStep).toBe(2)
  })

  it('goes to previous step', () => {
    const state = useCookStore.getState()
    state.connect('recipe-1', 'Test', 5)
    state.nextStep()
    state.prevStep()

    expect(useCookStore.getState().currentStep).toBe(1)
    expect(cookConnection.send).toHaveBeenCalledWith({ action: 'prev' })
  })

  it('does not go below step 1', () => {
    const state = useCookStore.getState()
    state.connect('recipe-1', 'Test', 5)
    state.prevStep()

    expect(useCookStore.getState().currentStep).toBe(1)
  })

  it('controls timer', () => {
    const state = useCookStore.getState()
    state.connect('recipe-1', 'Test', 5)

    state.startTimer()
    expect(useCookStore.getState().timerRunning).toBe(true)
    expect(cookConnection.send).toHaveBeenCalledWith({ action: 'timer_start' })

    state.pauseTimer()
    expect(useCookStore.getState().timerRunning).toBe(false)
    expect(cookConnection.send).toHaveBeenCalledWith({ action: 'pause' })

    state.resetTimer()
    const after = useCookStore.getState()
    expect(after.timerRunning).toBe(false)
    expect(after.timerRemaining).toBe(0)
  })

  it('setRecipeSteps updates steps array', () => {
    const state = useCookStore.getState()
    const steps = [{ description: 'New step' }]
    state.setRecipeSteps(steps)
    expect(useCookStore.getState().steps).toEqual(steps)
  })
})
