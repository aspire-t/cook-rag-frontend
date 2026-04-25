import React from 'react'
import { View, Text } from '@tarojs/components'
import type { IngredientItem } from '@/types'
import './index.css'

interface Props {
  ingredients: IngredientItem[]
}

export default function IngredientList({ ingredients }: Props) {
  return (
    <View className='ingredient-list'>
      <Text className='ingredient-list__title'>食材</Text>
      {ingredients.map((item, idx) => (
        <View key={idx} className='ingredient-list__item'>
          <Text className='ingredient-list__dot'>•</Text>
          <Text className='ingredient-list__name'>{item.name}</Text>
          {(item.amount || item.unit) && (
            <Text className='ingredient-list__amount'>
              {item.amount}{item.unit}
            </Text>
          )}
        </View>
      ))}
    </View>
  )
}
