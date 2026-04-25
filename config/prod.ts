import { defineConfig, mergeConfig } from '@tarojs/cli'
import defaultConfig from './index'

export default mergeConfig(defaultConfig, {
  mini: {},
  h5: {},
})
