const Router = require('koa-router')
const { Auth } = require('@root/middleware/auth')
const { Favor } = require('@models/favor')
const { LikeValidator } = require('@validators/validator')
const { Success } = require('@root/core/http-exception')
const router = new Router()

router.prefix('/v1/like')

router.post('/', new Auth().m, async (ctx, next) => {
  const v = await new LikeValidator().validate(ctx, {
    id: 'art_id'
  })
  await Favor.like(v.get('body.art_id'), v.get('body.type'), ctx.auth.uid)
  throw new Success()
})

router.post('/cancel', new Auth().m, async (ctx, next) => {
  const v = await new LikeValidator().validate(ctx, {
    id: 'art_id'
  })
  await Favor.dislike(v.get('body.art_id'), v.get('body.type'), ctx.auth.uid)
  throw new Success()
})

module.exports = router
