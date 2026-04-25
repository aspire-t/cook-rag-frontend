import '@testing-library/jest-dom'

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
