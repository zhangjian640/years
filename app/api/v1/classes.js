const Router = require('koa-router')
const { Flow } = require('@models/flow')
const { PositiveInterValidator, ClassicValidator } = require('@validators/validator')
const { NotFound } = require('@root/core/http-exception')
const { Art } = require('@models/art')
const { Favor } = require('@models/favor')
const { Auth } = require('@root/middleware/auth')
const router = new Router()

router.prefix('/v1/classic')

// 最新期刊
router.get('/latest', new Auth().m,async (ctx, next) => {
  const flow = await Flow.findOne({
    order: [['index', 'desc']]
  })
  const art = await Art.getData(flow.art_id, flow.type)
  const likeLatest = await Favor.userLikeIt(flow.art_id, flow.type, ctx.auth.uid)
  // 将flow.index 赋值给art.index
  // art.index = flow.index 不可行
  art.setDataValue('index', flow.index)
  art.setDataValue('like_status', likeLatest)
  ctx.body = art
})

// 当前期刊的下一期
router.get('/:index/next', new Auth().m, async ctx => {
  const v = await new PositiveInterValidator().validate(ctx, {
    id: 'index'
  })
  const index = v.get('path.index')
  const flow = await Flow.findOne({
    where:{
      index: index + 1
    }
  })
  if (!flow) {
    throw new NotFound()
  }
  const art = await Art.getData(flow.art_id, flow.type)
  const likeNext = await Favor.userLikeIt(flow.art_id, flow.type, ctx.auth.uid)
  art.setDataValue('index', flow.index)
  art.setDataValue('like_status', likeNext)
  // 在Sequelize 的Model上定义toJSON，序列化JSON
  // art.exclude = ['index', 'like_status']
  ctx.body = art
})

// 当前期刊的上一期
router.get('/:index/previous', new Auth().m, async ctx => {
  const v = await new PositiveInterValidator().validate(ctx, {
    id: 'index'
  })
  const index = v.get('path.index')
  const flow = await Flow.findOne({
    where:{
      index: index -1
    }
  })
  if (!flow) {
    throw new NotFound()
  }
  const art = await Art.getData(flow.art_id, flow.type)
  const likePrevious = await Favor.userLikeIt(flow.art_id, flow.type, ctx.auth.uid)
  art.setDataValue('index', flow.index)
  art.setDataValue('like_status', likePrevious)
  ctx.body = art
})

// 获取期刊点赞情况
router.get('/:type/:id/favor', new Auth().m, async ctx => {
  const v = await new ClassicValidator().validate(ctx)
  const id = v.get('path.id')
  const type = parseInt(v.get('path.type'))
  const artDetail = await new Art(id, type).getDetail(ctx.auth.uid)
  ctx.body = {
    fav_nums: artDetail.art.fav_nums,
    like_status: artDetail.like_status
  }
})

// 获取期刊点赞数
router.get('/favor', new Auth().m, async ctx => {
  const uid = ctx.auth.uid
  ctx.body = await Favor.getMyClassicFavors(uid)
})

// 获取期刊详情
router.get('/:type/:id', new Auth().m, async ctx => {
  const v = await new ClassicValidator().validate(ctx)
  const id = v.get('path.id')
  const type = parseInt(v.get('path.type'))
  const artDetail = await new Art(id, type).getDetail(ctx.auth.uid)
  artDetail.art.setDataValue('like_status', artDetail.like_status)
  ctx.body = artDetail.art
})

module.exports = router
