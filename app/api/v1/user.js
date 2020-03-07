const Router = require('koa-router')
const { RegisterValidator } = require('@validators/validator')
const { User } = require('@models/user')
const { Success } = require('@root/core/http-exception')

const router = new Router()

router.prefix('/v1/user')

// 注册
router.post('/register', async (ctx) => {
	// email, password,
	const v = await new RegisterValidator().validate(ctx)
	const user = {
		email: v.get('body.email'),
		password: v.get('body.password1'),
		nickname: v.get('body.nickname')
	}
	await User.create(user)
	throw new Success()
})

module.exports = router
