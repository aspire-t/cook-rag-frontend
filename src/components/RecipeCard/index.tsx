import React from 'react'
import Taro from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { useUserStore } from '@/store/useUserStore'
import { formatDifficulty, formatNumber } from '@/utils/format'
import type { RecipeCardData } from '@/types'
import './index.css'

interface Props {
  recipe: RecipeCardData
}

export default function RecipeCard({ recipe }: Props) {
  const isFavorite = useUserStore((s) => s.favorites.has(recipe.recipe_id))
  const toggleFavorite = useUserStore((s) => s.toggleFavorite)

  const handlePress = () => {
    Taro.navigateTo({ url: `/pages/detail/index?id=${recipe.recipe_id}` })
  }

  const handleFavorite = (e: any) => {
    e.stopPropagation()
    toggleFavorite(recipe.recipe_id)
  }

  return (
    <View className='recipe-card' onClick={handlePress}>
      <Image
        className='recipe-card__cover'
        src={recipe.cover_image || '/assets/default-cover.png'}
        mode='aspectFill'
      />
      <View className='recipe-card__content'>
        <Text className='recipe-card__name'>{recipe.name}</Text>
        {recipe.description && (
          <Text className='recipe-card__desc text-ellipsis'>{recipe.description}</Text>
        )}
        <View className='recipe-card__meta'>
          <View className='recipe-card__tags'>
            {recipe.cuisine && <Text className='recipe-card__tag'>{recipe.cuisine}</Text>}
            {recipe.difficulty && (
              <Text className='recipe-card__tag recipe-card__tag--difficulty'>
                {formatDifficulty(recipe.difficulty)}
              </Text>
            )}
          </View>
          <Text className={`recipe-card__fav ${isFavorite ? 'recipe-card__fav--active' : ''}`} onClick={handleFavorite}>
            {isFavorite ? '❤️' : '🤍'}
          </Text>
        </View>
      </View>
    </View>
  )
}
