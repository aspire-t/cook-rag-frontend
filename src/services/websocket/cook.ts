import Taro from '@tarojs/taro'

export type CookAction =
  | 'start'
  | 'next'
  | 'prev'
  | 'pause'
  | 'resume'
  | 'timer_start'
  | 'timer_stop'
  | 'status'
  | 'complete'

export interface CookMessage {
  type: string
  step?: number
  total_steps?: number
  remaining_seconds?: number
  message?: string
  [key: string]: any
}

export interface CookCallbacks {
  onStepUpdate?: (step: number, totalSteps: number) => void
  onTimerTick?: (remaining: number) => void
  onError?: (message: string) => void
  onConnected?: () => void
  onDisconnected?: () => void
}

class CookConnection {
  private socketTask: Taro.SocketTask | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 3
  private callbacks: CookCallbacks | null = null
  private recipeId: string | null = null
  private baseUrl: string

  constructor() {
    const envUrl = process.env.TARO_APP_WS_URL
    this.baseUrl = envUrl || 'ws://localhost:8000'
  }

  /** 建立连接并开始跟做 */
  connect(recipeId: string, callbacks: CookCallbacks): void {
    this.recipeId = recipeId
    this.callbacks = callbacks
    this.reconnectAttempts = 0
    this.openConnection()
  }

  private openConnection(): void {
    if (!this.recipeId) return

    this.socketTask = Taro.connectSocket({
      url: `${this.baseUrl}/ws/recipes/${this.recipeId}/cook`,
      success: () => {
        this.callbacks?.onConnected?.()
      },
    })

    this.socketTask.onOpen(() => {
      this.reconnectAttempts = 0
      // 发送 start 指令
      this.send({ action: 'start' })
    })

    this.socketTask.onMessage((res) => {
      try {
        const msg: CookMessage = JSON.parse(res.data)
        this.handleMessage(msg)
      } catch {
        // 非 JSON 消息，忽略
      }
    })

    this.socketTask.onClose(() => {
      this.callbacks?.onDisconnected?.()
      this.tryReconnect()
    })

    this.socketTask.onError(() => {
      this.tryReconnect()
    })
  }

  private handleMessage(msg: CookMessage): void {
    switch (msg.type) {
      case 'step_update':
        this.callbacks?.onStepUpdate?.(msg.step ?? 0, msg.total_steps ?? 0)
        break
      case 'timer_tick':
        this.callbacks?.onTimerTick?.(msg.remaining_seconds ?? 0)
        break
      case 'error':
        this.callbacks?.onError?.(msg.message || '未知错误')
        break
    }
  }

  private tryReconnect(): void {
    if (!this.recipeId || this.reconnectAttempts >= this.maxReconnectAttempts) {
      Taro.showToast({ title: '跟做连接已断开', icon: 'none' })
      return
    }
    this.reconnectAttempts++
    setTimeout(() => this.openConnection(), 2000 * this.reconnectAttempts)
  }

  /** 发送指令 */
  send(data: Record<string, any>): void {
    if (this.socketTask) {
      this.socketTask.send({
        data: JSON.stringify(data),
      })
    }
  }

  /** 断开连接 */
  disconnect(): void {
    this.reconnectAttempts = this.maxReconnectAttempts // 禁止重连
    if (this.recipeId) {
      this.send({ action: 'complete' })
    }
    this.socketTask?.close()
    this.socketTask = null
    this.callbacks = null
    this.recipeId = null
  }
}

export const cookConnection = new CookConnection()
