import Taro from '@tarojs/taro'

interface CacheEntry<T> {
  data: T
  expiresAt: number
}

const CACHE_PREFIX = 'cookrag_cache_'

/** 写入缓存（带 TTL，单位：毫秒） */
export function setCache<T>(key: string, data: T, ttl: number): void {
  const entry: CacheEntry<T> = {
    data,
    expiresAt: Date.now() + ttl,
  }
  try {
    Taro.setStorageSync(CACHE_PREFIX + key, JSON.stringify(entry))
  } catch (e) {
    // localStorage 满或其他异常，静默失败
  }
}

/** 读取缓存，过期返回 null */
export function getCache<T>(key: string): T | null {
  try {
    const raw = Taro.getStorageSync(CACHE_PREFIX + key)
    if (!raw) return null
    const entry: CacheEntry<T> = JSON.parse(raw)
    if (Date.now() > entry.expiresAt) {
      Taro.removeStorageSync(CACHE_PREFIX + key)
      return null
    }
    return entry.data
  } catch {
    return null
  }
}

/** 删除缓存 */
export function removeCache(key: string): void {
  try {
    Taro.removeStorageSync(CACHE_PREFIX + key)
  } catch {
    // ignore
  }
}

/** TTL 常量（毫秒） */
export const TTL = {
  SEARCH_RESULTS: 5 * 60 * 1000,       // 5 分钟
  RECIPE_DETAIL: 60 * 60 * 1000,        // 1 小时
  FILTER_OPTIONS: 24 * 60 * 60 * 1000,  // 1 天
}
