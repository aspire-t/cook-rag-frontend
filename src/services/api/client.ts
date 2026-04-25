import Taro from '@tarojs/taro'

const BASE_URL = '' // 走 devServer proxy 或同域部署

interface ApiResponse<T = any> {
  code: number
  message: string
  data?: T
}

/** GET 请求 */
export async function request<T = any>(
  url: string,
  options?: Omit<Taro.request.Option, 'url'>,
): Promise<T> {
  const token = Taro.getStorageSync('token')

  const res = await Taro.request({
    url: `${BASE_URL}${url}`,
    method: 'GET',
    header: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    timeout: 10000,
    ...options,
  })

  if (res.statusCode === 401) {
    // Token 过期，清除并跳转授权
    Taro.removeStorageSync('token')
    Taro.showToast({ title: '请重新登录', icon: 'none' })
    throw new Error('UNAUTHORIZED')
  }

  if (res.statusCode !== 200) {
    const errorData = res.data as ApiResponse
    throw new Error(errorData?.message || `HTTP ${res.statusCode}`)
  }

  return res.data as T
}

/** POST 请求 */
export async function post<T = any>(
  url: string,
  data?: Record<string, any>,
  options?: Omit<Taro.request.Option, 'url' | 'method' | 'data'>,
): Promise<T> {
  return request<T>(url, {
    method: 'POST',
    data,
    ...options,
  })
}

/** DELETE 请求 */
export async function del<T = any>(
  url: string,
  data?: Record<string, any>,
  options?: Omit<Taro.request.Option, 'url' | 'method' | 'data'>,
): Promise<T> {
  return request<T>(url, {
    method: 'DELETE',
    data,
    ...options,
  })
}
