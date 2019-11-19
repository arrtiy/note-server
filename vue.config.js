let webpackConfig = {}
const env = process.env.NODE_ENV
switch (env) {
  case 'development':
    webpackConfig = {
      devServer: {
        open: true,
        openPage: './',
      },
    }
    break;
  case 'production':
    webpackConfig = {
      publicPath: './',
      chainWebpack: config => {
        config.module.rules.delete('eslint');
      }
    }
    break;
  default:
    break;
}

module.exports = webpackConfig