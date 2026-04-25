import Taro from '@tarojs/taro'

declare const process: {
  env: {
    TARO_ENV: 'weapp' | 'h5' | string
  }
}

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
  private ws: WebSocket | null = null
  private socketTask: any = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 3
  private callbacks: CookCallbacks | null = null
  private recipeId: string | null = null
  private baseUrl: string

  constructor() {
    this.baseUrl = (typeof process !== 'undefined' && (process.env as Record<string, string>).WEBSOCKET_URL) || ''
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

    const url = `${this.baseUrl}/ws/recipes/${this.recipeId}/cook`

    if (process.env.TARO_ENV === 'h5') {
      // H5 环境使用原生 WebSocket
      this.ws = new WebSocket(url)

      this.ws.onopen = () => {
        this.reconnectAttempts = 0
        this.callbacks?.onConnected?.()
        this.send({ action: 'start' })
      }

      this.ws.onmessage = (event) => {
        try {
          const msg: CookMessage = JSON.parse(event.data)
          this.handleMessage(msg)
        } catch {
          // 非 JSON 消息，忽略
        }
      }

      this.ws.onclose = () => {
        this.callbacks?.onDisconnected?.()
        this.tryReconnect()
      }

      this.ws.onerror = () => {
        // onError 不触发重连，仅记录
      }
    } else {
      // 小程序环境使用 Taro.connectSocket
      this.socketTask = Taro.connectSocket({
        url,
        success: () => {
          this.callbacks?.onConnected?.()
        },
      })

      this.socketTask?.onOpen?.(() => {
        this.reconnectAttempts = 0
        this.send({ action: 'start' })
      })

      this.socketTask?.onMessage?.((res: any) => {
        try {
          const msg: CookMessage = JSON.parse(res.data)
          this.handleMessage(msg)
        } catch {
          // 非 JSON 消息，忽略
        }
      })

      this.socketTask?.onClose?.(() => {
        this.callbacks?.onDisconnected?.()
        this.tryReconnect()
      })

      this.socketTask?.onError?.(() => {
        // onError 不触发重连，仅记录
      })
    }
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
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data))
    } else if (this.socketTask) {
      this.socketTask.send({ data: JSON.stringify(data) })
    }
  }

  /** 断开连接 */
  disconnect(): void {
    this.reconnectAttempts = this.maxReconnectAttempts
    if (this.recipeId) {
      this.send({ action: 'complete' })
    }
    this.ws?.close()
    this.socketTask?.close()
    this.ws = null
    this.socketTask = null
    this.callbacks = null
    this.recipeId = null
  }
}

export const cookConnection = new CookConnection()
