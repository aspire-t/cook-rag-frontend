import { create } from 'zustand'
import { searchRecipes, recommendRecipes } from '@/services/api/search'
import { getCache, setCache, TTL } from '@/utils/cache'
import type { RecipeCardData, SearchFilters } from '@/types'

interface SearchState {
  query: string
  results: RecipeCardData[]
  loading: boolean
  hasMore: boolean
  page: number
  filters: SearchFilters

  setQuery: (query: string) => void
  search: (query: string, filters?: SearchFilters) => Promise<void>
  loadMore: () => Promise<void>
  setFilters: (filters: SearchFilters) => void
  reset: () => void
  loadRecommendations: () => Promise<void>
}

export const useSearchStore = create<SearchState>((set, get) => ({
  query: '',
  results: [],
  loading: false,
  hasMore: true,
  page: 1,
  filters: {},

  setQuery: (query) => set({ query }),

  search: async (query, filters) => {
    // 检查 L2 缓存
    const cacheKey = `search_${query}_${JSON.stringify(filters || {})}`
    const cached = getCache(cacheKey)
    if (cached) {
      set({ results: cached, query, loading: false, page: 1, hasMore: false, filters: filters || {} })
      return
    }

    set({ loading: true, results: [], page: 1, hasMore: true, query, filters: filters || {} })
    try {
      const res = await searchRecipes({ query, filters, top_k: 10 })
      const results = res.results.map((r) => ({
        recipe_id: r.recipe_id,
        name: r.name || '',
        description: r.description || '',
        cuisine: r.cuisine,
        difficulty: r.difficulty,
        prep_time: r.prep_time,
        cook_time: r.cook_time,
        score: r.score,
      }))
      setCache(cacheKey, results, TTL.SEARCH_RESULTS)
      set({ results, loading: false, hasMore: results.length >= 10 })
    } catch {
      set({ loading: false })
      Taro.showToast({ title: '搜索失败', icon: 'error' })
    }
  },

  loadMore: async () => {
    const { query, filters, page } = get()
    if (!query || !get().hasMore) return

    set({ loading: true })
    try {
      const res = await searchRecipes({ query, filters, top_k: 10 })
      const newResults = res.results.map((r) => ({
        recipe_id: r.recipe_id,
        name: r.name || '',
        description: r.description || '',
        cuisine: r.cuisine,
        difficulty: r.difficulty,
        prep_time: r.prep_time,
        cook_time: r.cook_time,
        score: r.score,
      }))
      set({ results: [...get().results, ...newResults], page: page + 1, loading: false, hasMore: newResults.length >= 10 })
    } catch {
      set({ loading: false })
    }
  },

  setFilters: (filters) => set({ filters }),

  reset: () => set({ query: '', results: [], loading: false, hasMore: true, page: 1, filters: {} }),

  loadRecommendations: async () => {
    const cached = getCache('recommendations')
    if (cached) {
      set({ results: cached, loading: false })
      return
    }

    set({ loading: true, results: [] })
    try {
      const res = await recommendRecipes()
      const results = res.results.map((r: any) => ({
        recipe_id: r.recipe_id,
        name: r.name || '',
        description: r.description || '',
        cuisine: r.cuisine,
        difficulty: r.difficulty,
        score: r.score,
      }))
      setCache('recommendations', results, TTL.SEARCH_RESULTS)
      set({ results, loading: false })
    } catch {
      set({ loading: false })
    }
  },
}))
