import { describe, it, expect, vi, beforeEach } from 'vitest'
import Taro from '@tarojs/taro'
import { request, post, del } from '@/services/api/client'

describe('API client', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(Taro.request).mockClear()
    vi.mocked(Taro.getStorageSync).mockClear()
  })

  it('request sends with correct method', async () => {
    vi.mocked(Taro.request).mockResolvedValue({ data: { ok: true }, statusCode: 200 } as any)

    await request('/test', { method: 'GET' })

    expect(Taro.request).toHaveBeenCalledWith(
      expect.objectContaining({ url: '/test', method: 'GET' })
    )
  })

  it('request includes auth token', async () => {
    vi.mocked(Taro.getStorageSync).mockReturnValue('token-123')
    vi.mocked(Taro.request).mockResolvedValue({ data: {}, statusCode: 200 } as any)

    await request('/test')

    expect(Taro.request).toHaveBeenCalledWith(
      expect.objectContaining({
        header: expect.objectContaining({ Authorization: 'Bearer token-123' }),
      })
    )
  })

  it('request returns data', async () => {
    vi.mocked(Taro.request).mockResolvedValue({ data: { name: 'test' }, statusCode: 200 } as any)

    const result = await request('/test')

    expect(result).toEqual({ name: 'test' })
  })

  it('post calls with POST method and data', async () => {
    vi.mocked(Taro.request).mockResolvedValue({ data: { created: true }, statusCode: 200 } as any)

    const result = await post('/test', { key: 'value' })

    expect(result).toEqual({ created: true })
    expect(Taro.request).toHaveBeenCalledWith(
      expect.objectContaining({ method: 'POST', data: { key: 'value' } })
    )
  })

  it('del calls with DELETE method', async () => {
    vi.mocked(Taro.request).mockResolvedValue({ data: { deleted: true }, statusCode: 200 } as any)

    const result = await del('/test/1')

    expect(result).toEqual({ deleted: true })
    expect(Taro.request).toHaveBeenCalledWith(
      expect.objectContaining({ method: 'DELETE' })
    )
  })

  it('handles non-200 response', async () => {
    vi.mocked(Taro.request).mockResolvedValue({ data: { error: 'not found' }, statusCode: 404 } as any)

    await expect(request('/test')).rejects.toThrow('HTTP 404')
  })

  it('handles 401 response', async () => {
    vi.mocked(Taro.request).mockResolvedValue({ data: {}, statusCode: 401 } as any)
    vi.mocked(Taro.removeStorageSync).mockImplementation(() => {})
    vi.mocked(Taro.showToast).mockImplementation(() => {})

    await expect(request('/test')).rejects.toThrow('UNAUTHORIZED')
    expect(Taro.removeStorageSync).toHaveBeenCalledWith('token')
    expect(Taro.showToast).toHaveBeenCalledWith({ title: '请重新登录', icon: 'none' })
  })
})
