const requireDirectory = require('require-directory')
const Router = require('koa-router')

class InitManager {
	// 入口方法
	static initCore(app) {
		InitManager.app = app
		InitManager.loadConfig()
		InitManager.initLoadRouter()
	}

	// 导入配置
	static loadConfig(path = '') {
		const configPath= path || process.cwd() + '/config/config.js'
		const config = require(configPath)
		global.config = config
	}

	// 批量注册路由
	static initLoadRouter() {
		const appDirectory = `${process.cwd()}/app/api`
		requireDirectory(module, appDirectory, {
			visit: whenLoadModule
		})

		function whenLoadModule(obj) {
			if (obj instanceof Router) {
				InitManager.app.use(obj.routes())
			}
		}
	}

	// 挂载错误类
	// static loadHttpException() {
	// 	const errors = require('./http-exception')
	// 	global.errs = errors
	// }
}

module.exports = InitManager
