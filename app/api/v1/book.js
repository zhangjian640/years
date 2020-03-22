const Router = require('koa-router')
const { HotBook } = require('@models/hot-book')
const { Book } = require('@models/book')
const { Auth } = require('@root/middleware/auth')
const { PositiveInterValidator, SearchValidator, AddSortCommentValidator } = require('@validators/validator')
const { Favor } = require('@models/favor')
const { Comment } = require('@models/book-comment')
const { Success } = require('@root/core/http-exception')

const router = new Router()

router.prefix('/v1/book')

router.get('/hot_keyword', async (ctx, next) => {
  const hotBooks = await Book.getHotBook()
  const hot = []
  hotBooks.forEach(item => {
    hot.push(item.HotBook.title)
  })
  ctx.body = {
    hot
  }
})

router.get('/hot_list', async (ctx, next) => {
  const books = await HotBook.getAll()
  ctx.body = books
})

router.get('/:id/detail', async ctx => {
  const v = await new PositiveInterValidator().validate(ctx)
  const id = v.get('path.id')
  const book = new Book()
  ctx.body = await book.detail(id)
})

// 书籍搜索
router.get('/search', async ctx => {
  const v = await new SearchValidator().validate(ctx)
  const q = v.get('query.q')
  const count = v.get('query.count')
  const start = v.get('query.start')
  const result = await Book.searchFromDouBan({q, start, count})
  ctx.body = result
})

// 我喜欢的书籍数量
router.get('/favor/count', new Auth().m, async ctx => {
  const count = await Book.getMyFavorBookCount(ctx.auth.uid)
  ctx.body = {
    count
  }
})

// 获取书籍点赞数量
router.get('/:book_id/favor', new Auth().m, async ctx => {
  const v = await new PositiveInterValidator().validate(ctx, {
    id: 'book_id'
  })
  const bookId = v.get('path.book_id')
  const favor = await Favor.getBookFavor(ctx.auth.uid, bookId)
  ctx.body = favor
})

// 书籍评论
router.post('/add/short_comment', new Auth().m, async ctx => {
  const v = await new AddSortCommentValidator().validate(ctx, {
    id: 'book_id'
  })
  const bookId = v.get('body.book_id')
  const content = v.get('body.content')
  await Comment.addComment(bookId, content)
  throw new Success()
})

// 获取书籍评论
router.get('/:book_id/short_comment', new Auth().m, async ctx => {
  const v = await new PositiveInterValidator().validate(ctx, {
    id: 'book_id'
  })
  const book_id = v.get('path.book_id')
  const comments = await Comment.getComments(book_id)
  ctx.body = {
    comments,
    book_id
  }
} )
module.exports = router
