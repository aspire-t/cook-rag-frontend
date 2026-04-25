import React, { useEffect, useState } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import IngredientList from '@/components/IngredientList'
import StepList from '@/components/StepList'
import { useCookStore } from '@/store/useCookStore'
import { getRecipeDetail } from '@/services/api/recipe'
import { getCache, setCache, TTL } from '@/utils/cache'
import { useUserStore } from '@/store/useUserStore'
import { formatDifficulty, formatNumber } from '@/utils/format'
import type { RecipeDetail as RecipeDetailType } from '@/types'
import './index.css'

export default function DetailPage() {
  const router = useRouter()
  const recipeId = router.params.id || ''

  const [detail, setDetail] = useState<RecipeDetailType | null>(null)
  const [loading, setLoading] = useState(true)
  const isFavorite = useUserStore((s) => s.favorites.has(recipeId))
  const toggleFavorite = useUserStore((s) => s.toggleFavorite)
  const setRecipeSteps = useCookStore((s) => s.setRecipeSteps)

  useEffect(() => {
    let cancelled = false

    const cached = getCache<RecipeDetailType>(`recipe_${recipeId}`)
    if (cached) {
      setDetail(cached)
      setLoading(false)
    }

    getRecipeDetail(recipeId)
      .then((data) => {
        if (!cancelled) {
          setDetail(data)
          setCache(`recipe_${recipeId}`, data, TTL.RECIPE_DETAIL)
          setLoading(false)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setLoading(false)
          Taro.showToast({ title: '加载失败', icon: 'error' })
        }
      })

    return () => {
      cancelled = true
    }
  }, [recipeId])

  const handleCook = () => {
    if (detail) {
      // 先将步骤数据传入 cook store
      const steps = detail.steps.map((s) => ({
        description: s.description,
        duration: s.duration_seconds,
      }))
      setRecipeSteps(steps)

      Taro.navigateTo({
        url: `/pages/cook/index?id=${recipeId}&name=${encodeURIComponent(detail.name)}&steps=${detail.steps.length}`,
      })
    }
  }

  if (loading) {
    return <View className='page-container detail-page__loading'>加载中...</View>
  }

  if (!detail) {
    return <View className='page-container detail-page__error'>菜谱不存在</View>
  }

  return (
    <View className='page-container safe-area-bottom'>
      {/* 封面图 */}
      <Image
        className='detail-page__cover'
        src={detail.cover_image || '/assets/default-cover.png'}
        mode='aspectFill'
      />

      {/* 返回按钮 */}
      <View className='detail-page__back' onClick={() => Taro.navigateBack()}>
        <Text>←</Text>
      </View>

      {/* 基本信息 */}
      <View className='detail-page__info'>
        <Text className='detail-page__name'>{detail.name}</Text>
        <View className='detail-page__meta'>
          {detail.cuisine && <Text className='detail-page__tag'>{detail.cuisine}</Text>}
          {detail.difficulty && (
            <Text className='detail-page__tag detail-page__tag--difficulty'>
              {formatDifficulty(detail.difficulty)}
            </Text>
          )}
        </View>
        <View className='detail-page__stats'>
          <Text className='detail-page__stat'>
            {isFavorite ? '❤️' : '🤍'} {formatNumber(detail.favorites_count)}
          </Text>
          {(detail.prep_time || detail.cook_time) && (
            <Text className='detail-page__stat'>
              ⏱ {(detail.prep_time || 0) + (detail.cook_time || 0)}分钟
            </Text>
          )}
        </View>
      </View>

      {/* 食材 */}
      {detail.ingredients.length > 0 && <IngredientList ingredients={detail.ingredients} />}

      {/* 步骤 */}
      {detail.steps.length > 0 && <StepList steps={detail.steps} />}

      {/* 底部跟做按钮 */}
      <View className='detail-page__cook-btn' onClick={handleCook}>
        <Text>开始跟做 ▶</Text>
      </View>
    </View>
  )
}
