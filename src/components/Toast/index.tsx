import Taro from '@tarojs/taro'

/** 封装 Taro.showToast，统一样式 */
export function showToast(title: string, icon: 'success' | 'error' | 'none' = 'none') {
  Taro.showToast({ title, icon })
}
