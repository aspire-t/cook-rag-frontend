import React from 'react'
import { View, Text } from '@tarojs/components'
import './index.css'

const CUISINES = ['川菜', '粤菜', '鲁菜', '苏菜', '浙菜', '闽菜', '湘菜', '徽菜']
const DIFFICULTIES = ['简单', '中等', '困难']

interface Props {
  onFilter: (cuisine?: string, difficulty?: string) => void
}

export default function FilterBar({ onFilter }: Props) {
  return (
    <View className='filter-bar'>
      {CUISINES.map((c) => (
        <Text
          key={c}
          className='filter-bar__tag'
          onClick={() => onFilter(c, undefined)}
        >
          {c}
        </Text>
      ))}
    </View>
  )
}
