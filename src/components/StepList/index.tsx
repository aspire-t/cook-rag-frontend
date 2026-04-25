import React from 'react'
import { View, Text } from '@tarojs/components'
import type { StepItem } from '@/types'
import './index.css'

interface Props {
  steps: StepItem[]
}

export default function StepList({ steps }: Props) {
  return (
    <View className='step-list'>
      <Text className='step-list__title'>步骤</Text>
      {steps.map((step) => (
        <View key={step.step_no} className='step-list__item'>
          <View className='step-list__number'>{step.step_no}</View>
          <Text className='step-list__content'>{step.description}</Text>
        </View>
      ))}
    </View>
  )
}
