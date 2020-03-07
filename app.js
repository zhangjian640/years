require('module-alias/register')
const Koa = require('koa')
const path = require('path')
const static = require('koa-static')
const InitManager = require('./core/init')
const bodyParser = require('koa-bodyparser')
const catchError = require('./middleware/expection')

const app = new Koa() // 应用程序对象
app.use(catchError)
app.use(bodyParser())
app.use(static(path.join(__dirname, './static')))
InitManager.initCore(app)
app.listen(4000)
