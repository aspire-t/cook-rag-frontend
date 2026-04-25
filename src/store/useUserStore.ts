import Taro from '@tarojs/taro'
import { create } from 'zustand'
import { addFavorite, removeFavorite, getFavorites } from '@/services/api/favorite'

interface UserState {
  token: string | null
  favorites: Set<string>

  setToken: (token: string) => void
  toggleFavorite: (id: string) => Promise<void>
  isFavorite: (id: string) => boolean
  loadFavorites: () => Promise<void>
}

export const useUserStore = create<UserState>((set, get) => ({
  token: Taro.getStorageSync('token') || null,
  favorites: new Set<string>(),

  setToken: (token) => {
    Taro.setStorageSync('token', token)
    set({ token })
  },

  toggleFavorite: async (id) => {
    // 保存原始状态用于回滚
    const originalFavorites = new Set(get().favorites)
    const isFav = originalFavorites.has(id)

    // 乐观更新
    const newFavorites = new Set(originalFavorites)
    if (isFav) {
      newFavorites.delete(id)
    } else {
      newFavorites.add(id)
    }
    set({ favorites: newFavorites })

    try {
      if (isFav) {
        await removeFavorite(id)
      } else {
        await addFavorite(id)
      }
    } catch {
      // 回滚到原始状态
      set({ favorites: originalFavorites })
      Taro.showToast({ title: '操作失败', icon: 'error' })
    }
  },

  isFavorite: (id) => get().favorites.has(id),

  loadFavorites: async () => {
    try {
      const res = await getFavorites()
      const ids = new Set(res.favorites.map((f) => f.recipe_id))
      set({ favorites: ids })
    } catch {
      // 未登录或网络错误，忽略
    }
  },
}))
