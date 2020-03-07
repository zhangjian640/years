const Router = require('koa-router')
const { TokenValidator, NotEmptyValidator } = require('@validators/validator')
const { User } = require('@models/user')
const { ParameterException } = require('@root/core/http-exception')
const { Auth } = require('@root/middleware/auth')
const { LoginType } = require('@root/app/lib/enum')
const { generateToken } =  require('@root/core/util')
const { WXManager } = require('@root/app/services/wx')

const router = new Router()

router.prefix('/v1/token')

// 注册
router.post('/', async (ctx) => {
	const v = await new TokenValidator().validate(ctx)
	let token
	switch (v.get('body.type')) {
		case LoginType.USER_EMAIL:
			token = await emailLogin(v.get('body.account'), v.get('body.secret'))

			break
		case LoginType.USER_MINI_PROGRAM:
			token = await WXManager.codeToToken(v.get('body.account'))
			break
		default:
			throw new ParameterException('没有相应的处理函数')
	}
	ctx.body = {
		token
	}
})

router.post('/verify', async (ctx) => {
	const v = await new NotEmptyValidator().validate(ctx)
	const result = await Auth.verifyToken(v.get('body.token'))
	ctx.body = {
		is_valid: result
	}
})

async function emailLogin(account, secret) {
	const user = await User.verifyEmailPassword(account, secret)
	return generateToken(user.id, Auth.USER)
}

module.exports = router
