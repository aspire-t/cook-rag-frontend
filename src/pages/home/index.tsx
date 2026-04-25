import React, { useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import SearchBar from '@/components/SearchBar'
import RecipeCard from '@/components/RecipeCard'
import { useSearchStore } from '@/store/useSearchStore'
import './index.css'

const QUICK_FILTERS = ['川菜', '粤菜', '快手菜', '素菜', '甜品']

export default function HomePage() {
  const results = useSearchStore((s) => s.results)
  const loading = useSearchStore((s) => s.loading)
  const loadRecommendations = useSearchStore((s) => s.loadRecommendations)

  useEffect(() => {
    loadRecommendations()
  }, [loadRecommendations])

  const handleSearch = (value: string) => {
    Taro.navigateTo({ url: `/pages/search/index?query=${encodeURIComponent(value)}` })
  }

  const handleFilter = (cuisine: string) => {
    Taro.navigateTo({ url: `/pages/search/index?filter=${encodeURIComponent(cuisine)}` })
  }

  return (
    <View className='page-container safe-area-bottom'>
      {/* Logo */}
      <View className='home__header'>
        <Text className='home__logo'>CookRAG</Text>
      </View>

      {/* 搜索框 */}
      <SearchBar value='' onSearch={handleSearch} />

      {/* 快速筛选 */}
      <View className='home__filters'>
        {QUICK_FILTERS.map((f) => (
          <Text key={f} className='home__filter-tag' onClick={() => handleFilter(f)}>
            {f}
          </Text>
        ))}
      </View>

      {/* 热门菜谱 */}
      <Text className='home__section-title'>热门菜谱</Text>
      {loading ? (
        <View className='home__loading'>加载中...</View>
      ) : (
        results.map((recipe) => <RecipeCard key={recipe.recipe_id} recipe={recipe} />)
      )}
    </View>
  )
}
