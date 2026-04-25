import React, { useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Input, Text } from '@tarojs/components'
import './index.css'

interface Props {
  value: string
  onSearch: (value: string) => void
  placeholder?: string
  showVoice?: boolean
  showImage?: boolean
  onVoiceSearch?: () => void
  onImageSearch?: () => void
}

export default function SearchBar({
  value,
  onSearch,
  placeholder = '搜索菜谱...',
  showVoice = true,
  showImage = true,
  onVoiceSearch,
  onImageSearch,
}: Props) {
  const [inputValue, setInputValue] = useState(value)

  const handleConfirm = () => {
    if (inputValue.trim()) {
      onSearch(inputValue.trim())
    }
  }

  return (
    <View className='search-bar'>
      <Input
        className='search-bar__input'
        value={inputValue}
        placeholder={placeholder}
        placeholderClass='search-bar__placeholder'
        confirmType='search'
        onInput={(e) => setInputValue(e.detail.value)}
        onConfirm={handleConfirm}
      />
      <View className='search-bar__actions'>
        {showVoice && (
          <Text className='search-bar__icon' onClick={onVoiceSearch}>🎤</Text>
        )}
        {showImage && (
          <Text className='search-bar__icon' onClick={onImageSearch}>📷</Text>
        )}
      </View>
    </View>
  )
}
