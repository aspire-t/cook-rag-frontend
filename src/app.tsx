import React, { useEffect } from 'react'
import Taro from '@tarojs/taro'
import './styles/tokens.css'
import './styles/common.css'

function App({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // 启动时初始化收藏状态
    import('@/store/useUserStore').then(({ useUserStore }) => {
      useUserStore.getState().loadFavorites()
    })
  }, [])

  return children
}

export default App
