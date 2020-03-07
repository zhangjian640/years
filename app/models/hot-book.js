const { Sequelize, Model, Op } = require('sequelize')
const { sequelize } = require('@root/core/db')
const { Favor } = require('@models/favor')

class HotBook extends Model{
	static async getAll() {
		const books = await HotBook.findAll({
			order: [
				'index'
			]
		})
		const booksIds = []
		books.forEach(book => {
			booksIds.push(book.id)
		})
		const favors = await Favor.findAll({
			where: {
				art_id: {
					[Op.in]: booksIds,
					type: 400
				}
			},
			group: ['art_id'],
			attributes: ['art_id', [Sequelize.fn('COUNT', '*'), 'count']]
		})
		books.forEach(book => {
			HotBook._getEachBookStatus(book, favors)
		})
		return books
	}

	static async detail(id) {
		const book = await HotBook.findOne({
			where: {
				id
			}
		})
		return book
	}

	static _getEachBookStatus(book, favors) {
		let count = 0
		favors.forEach(favor => {
			if (book.id === favor.art_id){
				count = favor.get('count')
			}
		})
		book.setDataValue('fav_nums', count)
		return book
	}
}

HotBook.init({
	index: Sequelize.INTEGER,
	image: Sequelize.STRING,
	author: Sequelize.STRING,
	title: Sequelize.STRING
}, {
	sequelize,
	tableName: 'hot_book'
})

module.exports = {
	HotBook
}
