const baiscAuth = require('basic-auth')
const jwt = require('jsonwebtoken')
const { Forbidden } = require('../core/http-exception')
class Auth {
	constructor(level) {
		this.level = level || 1
		Auth.USER = 8
		Auth.ADMIN = 16
		Auth.SUPER_ADMIN = 32
	}

	get m() {
		return async (ctx, next) => {
			// token 拦截
			const userToken = baiscAuth(ctx.req)
			let errMsg = 'token不合法'
			let decode
			if (!userToken || !userToken.name) {
				throw new Forbidden(errMsg)
			}
			try {
				decode = jwt.verify(userToken.name, global.config.security.secretKey)
			} catch (error) {
				// token 不合法
				// token 过期
				if (error.name === 'TokenExpiredError') {
					errMsg = 'token已过期'
				}
				throw new Forbidden(errMsg)
			}

			if (decode.scope < this.level) {
				errMsg = '权限不足'
				throw new Forbidden(errMsg)
			}

			ctx.auth = {
				uid: decode.uid,
				scope: decode.scope
			}
			await next()
		}
	}

	static verifyToken(token) {
		try {
			jwt.verify(token, global.config.security.secretKey)
			return true
		} catch (e) {
			return false
		}
	}
}

module.exports = {
	Auth
}
