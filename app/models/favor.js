
const { Sequelize, Model, Op } = require('sequelize')
const { sequelize } = require('@root/core/db')
const { LikeError, DisLikeError, NotFound } = require('@root/core/http-exception')
const { Art } = require('@models/art')
const { Movie, Music, Sentence } = require('@models/classic')

class Favor extends Model{
	static async like(art_id, type, uid) {
		// 1. 添加记录
		// 2. classic 修改fav_nums
		// 数据库事务，保证数据一致性
		// 关系型数据 ACID
		// A 原子性 一致性 隔离性 持久性
		const favor = await Favor.findOne({
			where: {
				art_id,
				type,
				uid
			}
		})
		if (favor) {
			throw new LikeError()
		}
		return sequelize.transaction(async t => {
			await Favor.create({
				art_id,
				type,
				uid
			}, {transaction: t})
			const art = await Art.getData(art_id, type, false)
			await art.increment('fav_nums', {by: 1, transaction: t})
		})
	}
	static async dislike(art_id, type, uid) {
		const favor = await Favor.findOne({
			where: {
				art_id,
				type,
				uid
			}
		})
		if (!favor) {
			throw new DisLikeError()
		}
		return sequelize.transaction(async t => {
			await favor.destroy({
				force: false,
				transaction: t
			})
			const art = await Art.getData(art_id, type, false)
			await art.decrement('fav_nums', {by: 1, transaction: t})
		})
	}
	static async userLikeIt(art_id, type, uid) {
		const favor = await Favor.findOne({
			uid,
			art_id,
			type
		})
		return !!favor
	}
	static async getMyClassicFavors(uid){
		const arts = await Favor.findAll({
			where: {
				uid,
				type: {
					[Op.not]: 400
				}
			}
		})
		if (!arts) {
			throw new NotFound()
		}
		return await Art.getList(arts)
	}

	static async getBookFavor(uid, bookId) {
		const favorNums = await Favor.count({
			where: {
				art_id: bookId,
				type: 400
			}
		})
		const myFavor = await Favor.findOne({
			where: {
				art_id: bookId,
				uid,
				type: 400
			}
		})
		return {
			fav_nums: favorNums,
			like_status: myFavor ? 1 : 0
		}
	}

}

Favor.init({
	uid: Sequelize.INTEGER,
	art_id: Sequelize.INTEGER,
	type: Sequelize.INTEGER
}, {
	sequelize,
	tableName: 'favor'
})

module.exports = {
	Favor
}
