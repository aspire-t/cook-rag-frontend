import React, { useEffect, useState } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { View, ScrollView, Text } from '@tarojs/components'
import SearchBar from '@/components/SearchBar'
import RecipeCard from '@/components/RecipeCard'
import FilterBar from '@/components/FilterBar'
import { useSearchStore } from '@/store/useSearchStore'
import './index.css'

export default function SearchPage() {
  const router = useRouter()
  const query = router.params.query || ''
  const filter = router.params.filter || ''

  const results = useSearchStore((s) => s.results)
  const loading = useSearchStore((s) => s.loading)
  const hasMore = useSearchStore((s) => s.hasMore)
  const search = useSearchStore((s) => s.search)
  const loadMore = useSearchStore((s) => s.loadMore)
  const setFilters = useSearchStore((s) => s.setFilters)

  const [searchInput, setSearchInput] = useState(query)

  useEffect(() => {
    if (query) {
      search(query, filter ? { cuisine: filter } : undefined)
      setSearchInput(query)
    } else if (filter) {
      search('', { cuisine: filter })
    }
  }, [query, filter, search])

  const handleSearch = (value: string) => {
    setSearchInput(value)
    search(value)
  }

  const handleFilter = (cuisine?: string) => {
    setFilters(cuisine ? { cuisine } : {})
    search(searchInput, cuisine ? { cuisine } : undefined)
  }

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      loadMore()
    }
  }

  return (
    <View className='page-container safe-area-bottom'>
      <View className='search-page__header'>
        <Text className='search-page__back' onClick={() => Taro.navigateBack()}>←</Text>
        <SearchBar value={searchInput} onSearch={handleSearch} onChange={setSearchInput} showVoice={false} showImage={false} />
      </View>
      <FilterBar onFilter={handleFilter} />

      <ScrollView scrollY className='search-page__list' onScrollToLower={handleLoadMore}>
        {results.length === 0 && !loading ? (
          <View className='search-page__empty'>
            <Text>没有找到相关菜谱</Text>
            <Text className='search-page__empty-hint'>试试其他关键词吧</Text>
          </View>
        ) : (
          <>
            {results.map((recipe) => (
              <RecipeCard key={recipe.recipe_id} recipe={recipe} />
            ))}
            {loading && <View className='search-page__loading'>加载中...</View>}
            {!hasMore && results.length > 0 && (
              <View className='search-page__end'>— 到底了 —</View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  )
}
