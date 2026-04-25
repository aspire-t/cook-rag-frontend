import { defineConfig, mergeConfig } from '@tarojs/cli'
import defaultConfig from './index'

export default mergeConfig(defaultConfig, {
  mini: {
    optimizeMainPackage: { enable: true },
  },
  h5: {
    devServer: {
      hot: true,
    },
  },
})
