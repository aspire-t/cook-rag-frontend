import { request } from './client'
import type { FavoriteItem } from '@/types'

/** 添加收藏 */
export async function addFavorite(recipeId: string): Promise<{ message: string }> {
  return request('/api/v1/favorites', {
    method: 'POST',
    data: { recipe_id: recipeId },
  })
}

/** 取消收藏 */
export async function removeFavorite(recipeId: string): Promise<{ message: string }> {
  return request(`/api/v1/favorites/${recipeId}`, {
    method: 'DELETE',
  })
}

/** 获取收藏列表 */
export async function getFavorites(): Promise<{ favorites: FavoriteItem[] }> {
  return request('/api/v1/favorites')
}
