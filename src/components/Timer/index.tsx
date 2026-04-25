import React from 'react'
import { View, Text } from '@tarojs/components'
import { formatTime } from '@/utils/format'
import './index.css'

interface Props {
  seconds: number
  running: boolean
  onStart: () => void
  onPause: () => void
  onReset: () => void
}

export default function Timer({ seconds, running, onStart, onPause, onReset }: Props) {
  return (
    <View className='timer'>
      <Text className='timer__display'>{formatTime(seconds)}</Text>
      <View className='timer__controls'>
        {running ? (
          <Text className='timer__btn timer__btn--primary' onClick={onPause}>❚❚</Text>
        ) : (
          <Text className='timer__btn timer__btn--primary' onClick={onStart}>▶</Text>
        )}
        <Text className='timer__btn timer__btn--secondary' onClick={onReset}>↻</Text>
      </View>
    </View>
  )
}
