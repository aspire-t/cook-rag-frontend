import { describe, it, expect, vi, beforeEach } from 'vitest'
import Taro from '@tarojs/taro'
import { setCache, getCache, TTL } from '@/utils/cache'

describe('cache', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('sets and gets cached data', () => {
    const mockStorage: Record<string, string> = {}
    vi.mocked(Taro.setStorageSync).mockImplementation((key: string, data: string) => {
      mockStorage[key] = data
    })
    vi.mocked(Taro.getStorageSync).mockImplementation((key: string) => {
      return mockStorage[key] || null
    })

    setCache('test_key', { name: 'test' }, 3600000)
    const result = getCache('test_key')
    expect(result).toEqual({ name: 'test' })
  })

  it('returns null for expired data', () => {
    const expiredEntry = JSON.stringify({ data: 'old', expiresAt: Date.now() - 1000 })
    vi.mocked(Taro.getStorageSync).mockReturnValue(expiredEntry)

    const result = getCache('expired_key')
    expect(result).toBeNull()
  })

  it('returns null for non-existent key', () => {
    vi.mocked(Taro.getStorageSync).mockReturnValue(null)
    expect(getCache('non_existent')).toBeNull()
  })

  it('stores data with correct TTL', () => {
    let stored = ''
    vi.mocked(Taro.setStorageSync).mockImplementation((key: string, data: string) => {
      stored = data
    })

    setCache('ttl_test', 'value', 60000)
    const entry = JSON.parse(stored)
    expect(entry.data).toBe('value')
    expect(entry.expiresAt).toBeGreaterThan(Date.now() + 50000)
  })
})
