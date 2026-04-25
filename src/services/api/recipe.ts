import { request } from './client'
import type { RecipeDetail } from '@/types'

/** 获取菜谱详情 */
export async function getRecipeDetail(recipeId: string): Promise<RecipeDetail> {
  return request<RecipeDetail>(`/api/v1/recipes/${recipeId}`)
}

/** 获取菜谱图片列表 */
export async function getRecipeImages(
  recipeId: string,
): Promise<{ cover?: { image_url: string }; steps: { step_no: number; image_url: string }[] }> {
  return request(`/api/v1/recipes/${recipeId}/images`)
}
