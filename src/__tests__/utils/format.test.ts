import { describe, it, expect } from 'vitest'
import { formatTime, formatNumber, formatDifficulty } from '@/utils/format'

describe('formatTime', () => {
  it('formats seconds to MM:SS', () => {
    expect(formatTime(0)).toBe('00:00')
    expect(formatTime(60)).toBe('01:00')
    expect(formatTime(3661)).toBe('61:01')
  })

  it('pads single digits with leading zero', () => {
    expect(formatTime(5)).toBe('00:05')
    expect(formatTime(65)).toBe('01:05')
  })

  it('handles float seconds by flooring', () => {
    expect(formatTime(61.5)).toBe('01:01')
    expect(formatTime(119.9)).toBe('01:59')
    expect(formatTime(120.9)).toBe('02:00')
  })
})

describe('formatNumber', () => {
  it('returns number as string for values < 1000', () => {
    expect(formatNumber(0)).toBe('0')
    expect(formatNumber(500)).toBe('500')
    expect(formatNumber(999)).toBe('999')
  })

  it('formats values >= 1000 with k suffix', () => {
    expect(formatNumber(1000)).toBe('1.0k')
    expect(formatNumber(1234)).toBe('1.2k')
    expect(formatNumber(10500)).toBe('10.5k')
  })
})

describe('formatDifficulty', () => {
  it('translates known values', () => {
    expect(formatDifficulty('easy')).toBe('简单')
    expect(formatDifficulty('medium')).toBe('中等')
    expect(formatDifficulty('hard')).toBe('困难')
  })

  it('returns empty string for undefined', () => {
    expect(formatDifficulty(undefined)).toBe('')
  })

  it('returns original value for unknown difficulty', () => {
    expect(formatDifficulty('beginner')).toBe('beginner')
    expect(formatDifficulty('')).toBe('')
  })
})
