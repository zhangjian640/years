module.exports = {
	environment: 'dev',
	dataBase: {
		dbName: 'island',
		host: 'localhost',
		port: 3306,
		user: 'root' ,
		password: 'zhangjian640'
	},
	security: {
		secretKey: 'secret',
		expiresIn: 60*60*24*30
	},
	wx: {
		appId: 'wxaf610b005acfab18',
		appSecret: '886ac23744ad76d51808c1b42a5c02be',
		loginUrl: 'https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code'
	},
	douban:{
		detailUrl:'https://api.douban.com/v2/book/%s?apikey=0df993c66c0c636e29ecbb5344252a4a',
		keywordUrl:'https://api.douban.com/v2/book/search?q=%s&count=%s&start=%s&apikey=0df993c66c0c636e29ecbb5344252a4a'
	},
	host: 'http://localhost:3000/'
}
