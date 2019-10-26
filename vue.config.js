module.exports = {
    // publicPath: '/demo2',
    devServer: {
        port: 8888,        // 端口
        host: 'localhost', // 主机
        https: false,      // 协议
        open: true,        // 启动服务时自动打开浏览器
        proxy: {           // 开发环境代理配置
            // '/dev-api': {
            [process.env.VUE_APP_BASE_API]: {
                // 目标服务器地址
                // target: 'http://localhost:8001',
                target: process.env.VUE_APP_SERVICE_URL,
                // 开启代理服务器
                changeOrigin: true,
                pathRewrite: {
                    // 将最终的请求地址的前缀替换为空：http://localhost:8001/db.json（替换前：http://localhost:8001/dev-api/db.json）
                    // '^/dev-api': '',
                    ['^' + process.env.VUE_APP_BASE_API]: '',
                }
            }
        }
    },
    lintOnSave: false,     // 格式检查开关
    // outputDir: 'dist2',
    // assetsDir: 'assets2',
    // indexPath: 'out/index.html',
    productionSourceMap: false, // 打包时不会生成.map文件，加快打包速度

}