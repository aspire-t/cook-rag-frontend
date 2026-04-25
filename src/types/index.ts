/** 菜谱卡片数据 */
export interface RecipeCardData {
  recipe_id: string
  name: string
  description?: string
  cover_image?: string
  cuisine?: string
  difficulty?: string
  prep_time?: number
  cook_time?: number
  score?: number
}

/** 食材项 */
export interface IngredientItem {
  name: string
  amount?: string
  unit?: string
  sequence: number
}

/** 步骤项 */
export interface StepItem {
  step_no: number
  description: string
  duration_seconds?: number
}

/** 菜谱详情 */
export interface RecipeDetail {
  id: string
  name: string
  description?: string
  cuisine?: string
  difficulty?: string
  tags: string[]
  prep_time?: number
  cook_time?: number
  ingredients: IngredientItem[]
  steps: StepItem[]
  favorites_count: number
  views_count: number
  rating?: number
  is_public: boolean
  audit_status: string
  cover_image?: string
  step_images?: { step_no: number; url: string }[]
}

/** 筛选条件 */
export interface SearchFilters {
  cuisine?: string
  difficulty?: string
  sort?: string
}

/** 搜索结果 */
export interface SearchResult {
  query: string
  results: RecipeCardData[]
  total: number
  source: string
  duration_ms?: number
}

/** 收藏项 */
export interface FavoriteItem {
  recipe_id: string
  recipe_name: string
  created_at: string
}
