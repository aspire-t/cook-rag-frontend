export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/search/index',
    'pages/detail/index',
    'pages/cook/index',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#FF6B35',
    navigationBarTitleText: 'CookRAG',
    navigationBarTextStyle: 'white',
  },
})

function defineAppConfig(config: any) {
  return config
}
