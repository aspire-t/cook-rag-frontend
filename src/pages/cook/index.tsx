import React, { useEffect, useState } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import CookingNav from '@/components/CookingNav'
import Timer from '@/components/Timer'
import { useCookStore } from '@/store/useCookStore'
import { formatTime } from '@/utils/format'
import './index.css'

export default function CookPage() {
  const router = useRouter()
  const recipeId = router.params.id || ''
  const recipeName = decodeURIComponent(router.params.name || '')
  const totalSteps = parseInt(router.params.steps || '0', 10)

  const currentStep = useCookStore((s) => s.currentStep)
  const timerRemaining = useCookStore((s) => s.timerRemaining)
  const timerRunning = useCookStore((s) => s.timerRunning)
  const connect = useCookStore((s) => s.connect)
  const disconnect = useCookStore((s) => s.disconnect)
  const nextStep = useCookStore((s) => s.nextStep)
  const prevStep = useCookStore((s) => s.prevStep)
  const startTimer = useCookStore((s) => s.startTimer)
  const pauseTimer = useCookStore((s) => s.pauseTimer)
  const resetTimer = useCookStore((s) => s.resetTimer)

  useEffect(() => {
    connect(recipeId, recipeName, totalSteps)

    return () => {
      disconnect()
    }
  }, [recipeId, recipeName, totalSteps, connect, disconnect])

  const handleBack = () => {
    disconnect()
    Taro.navigateBack()
  }

  return (
    <View className='page-container cook-page safe-area-bottom'>
      {/* 顶部导航 */}
      <View className='cook-page__header'>
        <Text className='cook-page__back' onClick={handleBack}>←</Text>
        <Text className='cook-page__title'>{recipeName}</Text>
        <Text className='cook-page__progress'>{currentStep}/{totalSteps}</Text>
      </View>

      {/* 步骤内容 */}
      <View className='cook-page__step'>
        <Image
          className='cook-page__step-image'
          src='/assets/default-step.png'
          mode='aspectFit'
        />
        <Text className='cook-page__step-title'>步骤 {currentStep}</Text>
        {/* 这里可以从菜谱详情传入步骤描述 */}
        <Text className='cook-page__step-desc'>
          {currentStep} / {totalSteps}
        </Text>
      </View>

      {/* 计时器 */}
      <Timer
        seconds={timerRemaining}
        running={timerRunning}
        onStart={startTimer}
        onPause={pauseTimer}
        onReset={resetTimer}
      />

      {/* 底部导航 */}
      <CookingNav
        totalSteps={totalSteps}
        currentStep={currentStep}
        onNext={nextStep}
        onPrev={prevStep}
      />
    </View>
  )
}
