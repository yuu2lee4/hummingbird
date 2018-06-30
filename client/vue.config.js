module.exports = {
  lintOnSave: false,
  runtimeCompiler: true,
  devServer: {
    proxy: {
      '.*': {
        target: 'http://localhost:8888',
        changeOrigin: true,
        ws: false,
        pathRewrite: {},
        filter(pathname, req) {
          return /^\/(api|upload)/.test(pathname);
        }
      }
    }
  }
}