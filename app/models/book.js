const util = require('util')
const axios = require('axios')
const { Sequelize, Model, Op } = require('sequelize')
const { sequelize } = require('@root/core/db')
const { Favor } = require('@models/favor')
const { HotBook } = require('@models/hot-book')

class Book extends Model{
	static async getHotBook() {
		const hotBook = await Book.findAll({
			order: [
				['fav_nums', 'desc']
			],
			limit: 10,
			include: [
				{
					model: HotBook,
					attributes: ['title']
				}
			]
		})
		return hotBook	
	}
	async detail(id) {
		const url = util.format(global.config.douban.detailUrl, id)
		const detail = await axios.get(url)
		return detail.data
	}
	static async searchFromDouBan({q, start, count}) {
		const url = util.format(global.config.douban.keywordUrl, encodeURI(q), count, start)
		const result = await axios.get(url)
		return result.data
	}

	static async getMyFavorBookCount(uid) {
		const count = await Favor.count({
			where: {
				type: 400,
				uid
			}
		})
		return count
	}
}

Book.init({
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true
	},
	fav_nums: {
		type: Sequelize.INTEGER,
		defaultValue: 0
	}
}, {
	sequelize,
	tableName: 'book'
})

Book.belongsTo(HotBook, {
  foreignKey: 'id',
})

module.exports = {
	Book
}
