class HttpException extends Error{
	constructor(msg='服务器异常', errorCode=10000, code=400) {
		super()
		this.code = code
		this.msg =  msg
		this.errorCode = errorCode
	}

}

class ParameterException extends HttpException{
	constructor(msg, errorCode) {
		super()
		this.code = 400
		this.msg = msg || '参数错误'
		this.errorCode = errorCode || 10000
	}
}

class Success extends HttpException {
	constructor(msg, errorCode) {
		super()
		this.code = 201
		this.msg = msg || 'ok'
		this.errorCode = errorCode || 0
	}
}

class NotFound extends HttpException{
	constructor(msg, errorCode) {
		super()
		this.code = 404
		this.msg = msg || '资源未找到'
		this.errorCode = errorCode || 10000
	}
}

class AuthFailed extends HttpException{
	constructor(msg, errorCode) {
		super()
		this.code = 401
		this.msg = msg || '授权失败'
		this.errorCode = errorCode || 10004
	}
}

// 禁止访问
class Forbidden extends HttpException {
	constructor(msg, errorCode) {
		super()
		this.code = 403
		this.msg = msg || '禁止访问'
		this.errorCode = errorCode || 10006
	}
}

// 点赞
class LikeError extends HttpException{
	constructor(msg, errorCode) {
		super()
		this.code = 400
		this.msg = msg || '您已经点赞过'
		this.errorCode =  600001
	}
}

// 取消点赞
class DisLikeError extends HttpException{
	constructor(msg, errorCode) {
		super()
		this.code = 400
		this.msg = msg || '您已取消点赞'
		this.errorCode = 600002
	}
}

module.exports = {
	HttpException,
	ParameterException,
	Success,
	NotFound,
	AuthFailed,
	Forbidden,
	LikeError,
	DisLikeError
}
