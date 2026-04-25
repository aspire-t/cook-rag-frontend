import { post } from './client'
import type { SearchResult, SearchFilters, SearchResultItem } from '@/types'

export interface SearchRequest {
  query: string
  filters?: SearchFilters
  top_k?: number
  page?: number
  use_hybrid?: boolean
  use_rerank?: boolean
}

/** 搜索菜谱 */
export async function searchRecipes(req: SearchRequest): Promise<SearchResult> {
  return post<SearchResult>('/api/v1/search/search', {
    query: req.query,
    filters: req.filters,
    top_k: req.top_k ?? 10,
    page: req.page,
    use_hybrid: req.use_hybrid ?? true,
    use_rerank: false,
  })
}

/** 推荐菜谱 */
export async function recommendRecipes(
  context?: string,
  top_k = 10,
): Promise<{ results: SearchResultItem[]; source: string }> {
  return post('/api/v1/search/recommend', {
    context: context || '推荐菜谱',
    top_k,
  })
}
