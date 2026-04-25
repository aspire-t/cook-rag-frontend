import Taro from '@tarojs/taro'
import { create } from 'zustand'
import { searchRecipes, recommendRecipes } from '@/services/api/search'
import { getCache, setCache, TTL } from '@/utils/cache'
import type { RecipeCardData, SearchFilters, SearchResultItem } from '@/types'

/** 生成确定性的缓存 key（排序 filters 的 key 保证顺序一致） */
function makeCacheKey(query: string, filters?: SearchFilters): string {
  if (!filters) return `search_${query}_`
  const sorted = Object.keys(filters).sort().map((k) => `${k}:${filters![k]}`).join(',')
  return `search_${query}_${sorted}`
}

function mapRecipe(r: SearchResultItem): RecipeCardData {
  return {
    recipe_id: r.recipe_id,
    name: r.name || '',
    description: r.description || '',
    cuisine: r.cuisine,
    difficulty: r.difficulty,
    prep_time: r.prep_time,
    cook_time: r.cook_time,
    cover_image: r.cover_image,
    score: r.score,
  }
}

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
    const cacheKey = makeCacheKey(query, filters)
    const cached = getCache(cacheKey)
    if (cached) {
      set({ results: cached, query, loading: false, page: 1, hasMore: false, filters: filters || {} })
      return
    }

    set({ loading: true, results: [], page: 1, hasMore: true, query, filters: filters || {} })
    try {
      const res = await searchRecipes({ query, filters, top_k: 10 })
      const results = res.results.map(mapRecipe)
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
      const res = await searchRecipes({ query, filters, top_k: 10, page: page + 1 })
      const newResults = res.results.map(mapRecipe)
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
      const results = res.results.map(mapRecipe)
      setCache('recommendations', results, TTL.SEARCH_RESULTS)
      set({ results, loading: false })
    } catch {
      set({ loading: false })
    }
  },
}))
