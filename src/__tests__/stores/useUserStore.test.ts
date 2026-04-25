import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useUserStore } from '@/store/useUserStore'
import * as favoriteApi from '@/services/api/favorite'

vi.mock('@/services/api/favorite')

describe('useUserStore', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    const store = useUserStore.getState()
    useUserStore.setState({ favorites: new Set(), token: null })
  })

  it('initializes with empty favorites', () => {
    const store = useUserStore.getState()
    expect(store.favorites.size).toBe(0)
  })

  it('checks favorite status correctly', () => {
    const store = useUserStore.getState()
    useUserStore.setState({ favorites: new Set(['r1', 'r2']) })
    expect(store.isFavorite('r1')).toBe(true)
    expect(store.isFavorite('r3')).toBe(false)
  })

  it('toggles favorite - add', () => {
    vi.mocked(favoriteApi.addFavorite).mockResolvedValue({} as any)
    const store = useUserStore.getState()
    store.toggleFavorite('r1')
    expect(store.isFavorite('r1')).toBe(true)
    expect(favoriteApi.addFavorite).toHaveBeenCalledWith('r1')
  })

  it('toggles favorite - remove', () => {
    vi.mocked(favoriteApi.removeFavorite).mockResolvedValue({} as any)
    useUserStore.setState({ favorites: new Set(['r1']) })
    const store = useUserStore.getState()
    store.toggleFavorite('r1')
    expect(store.isFavorite('r1')).toBe(false)
    expect(favoriteApi.removeFavorite).toHaveBeenCalledWith('r1')
  })

  it('rolls back on API failure', async () => {
    vi.mocked(favoriteApi.addFavorite).mockRejectedValue(new Error('API error'))
    const store = useUserStore.getState()

    await store.toggleFavorite('r1')

    // Should roll back to original state (empty)
    expect(store.isFavorite('r1')).toBe(false)
  })
})
