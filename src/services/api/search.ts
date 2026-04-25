import { post } from './client'
import type { SearchResult, SearchFilters } from '@/types'

export interface SearchRequest {
  query: string
  filters?: SearchFilters
  top_k?: number
  use_hybrid?: boolean
  use_rerank?: boolean
}

/** 搜索菜谱 */
export async function searchRecipes(req: SearchRequest): Promise<SearchResult> {
  return post<SearchResult>('/api/v1/search/search', {
    query: req.query,
    filters: req.filters,
    top_k: req.top_k ?? 10,
    use_hybrid: req.use_hybrid ?? true,
    use_rerank: false, // 前端暂用 ES 结果，Rerank 在后端已关闭
  })
}

/** 推荐菜谱 */
export async function recommendRecipes(
  context?: string,
  top_k = 10,
): Promise<{ results: any[]; source: string }> {
  return post('/api/v1/search/recommend', {
    context: context || '推荐菜谱',
    top_k,
  })
}
