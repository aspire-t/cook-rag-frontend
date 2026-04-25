import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock Taro APIs for testing
const mockTaro = {
  request: vi.fn(() => Promise.resolve({ data: {}, statusCode: 200 })),
  showToast: vi.fn(),
  navigateTo: vi.fn(),
  navigateBack: vi.fn(),
  showLoading: vi.fn(),
  hideLoading: vi.fn(),
  getStorageSync: vi.fn(() => null),
  setStorageSync: vi.fn(),
  removeStorageSync: vi.fn(),
}

vi.mock('@tarojs/taro', () => ({
  default: mockTaro,
  ...mockTaro,
}))

// Mock @tarojs/components for component tests
vi.mock('@tarojs/components', () => {
  const createMockComponent = (tag: string) => {
    const Component = ({ children, ...props }: any) => {
      const { className, style, onClick, ...rest } = props
      return {
        type: tag,
        props: { className, style, onClick, ...rest },
        children,
      }
    }
    return Component
  }

  return {
    View: createMockComponent('view'),
    Text: createMockComponent('text'),
    Input: createMockComponent('input'),
    Image: createMockComponent('image'),
    ScrollView: createMockComponent('scroll-view'),
  }
})
