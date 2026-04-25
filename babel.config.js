module.exports = {
  presets: [
    ['taro', {
      framework: 'react',
      ts: true,
      hot: false, // 禁用内置的热刷新，避免 _s 冲突
    }],
  ],
}
