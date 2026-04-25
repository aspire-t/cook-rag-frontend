import React from 'react'
import Taro from '@tarojs/taro'
import { View, Input, Text } from '@tarojs/components'
import './index.css'

interface Props {
  value: string
  onSearch: (value: string) => void
  onChange?: (value: string) => void
  placeholder?: string
  showVoice?: boolean
  showImage?: boolean
  onVoiceSearch?: () => void
  onImageSearch?: () => void
}

export default function SearchBar({
  value,
  onSearch,
  onChange,
  placeholder = '搜索菜谱...',
  showVoice = true,
  showImage = true,
  onVoiceSearch,
  onImageSearch,
}: Props) {
  const handleConfirm = () => {
    if (value.trim()) {
      onSearch(value.trim())
    }
  }

  const handleInput = (e: any) => {
    onChange?.(e.detail.value)
  }

  return (
    <View className='search-bar'>
      <Input
        className='search-bar__input'
        value={value}
        placeholder={placeholder}
        placeholderClass='search-bar__placeholder'
        confirmType='search'
        onInput={handleInput}
        onConfirm={handleConfirm}
      />
      <View className='search-bar__actions'>
        {showVoice && (
          <Text className='search-bar__icon' onClick={() => onVoiceSearch?.()}>🎤</Text>
        )}
        {showImage && (
          <Text className='search-bar__icon' onClick={() => onImageSearch?.()}>📷</Text>
        )}
      </View>
    </View>
  )
}
