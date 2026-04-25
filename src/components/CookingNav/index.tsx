import React from 'react'
import { View, Text } from '@tarojs/components'
import './index.css'

interface Props {
  totalSteps: number
  currentStep: number
  onNext: () => void
  onPrev: () => void
}

export default function CookingNav({ totalSteps, currentStep, onNext, onPrev }: Props) {
  const dots = Array.from({ length: totalSteps }, (_, i) => i + 1)

  return (
    <View className='cooking-nav'>
      <View className='cooking-nav__dots'>
        {dots.map((n) => (
          <View
            key={n}
            className={`cooking-nav__dot ${n <= currentStep ? 'cooking-nav__dot--active' : ''}`}
          />
        ))}
      </View>
      <View className='cooking-nav__buttons'>
        <Text className={`cooking-nav__btn ${currentStep <= 1 ? 'cooking-nav__btn--disabled' : ''}`} onClick={currentStep > 1 ? onPrev : undefined}>
          ◀ 上一步
        </Text>
        <Text className={`cooking-nav__btn ${currentStep >= totalSteps ? 'cooking-nav__btn--disabled' : ''}`} onClick={currentStep < totalSteps ? onNext : undefined}>
          下一步 ▶
        </Text>
      </View>
    </View>
  )
}
