/**
 * 关联表
 */
const { Sequelize, Model } = require('sequelize')
const { sequelize } = require('../../core/db')
const { NotFound, AuthFailed } = require('../../core/http-exception')
class Flow extends Model{
}

Flow.init({
	index: Sequelize.INTEGER, // 序号
	art_id: Sequelize.INTEGER, // 实体id movie music sentence
	type: Sequelize.INTEGER // 类型 movie 100, music 200 sentence 300
}, {
	sequelize,
	tableName: 'flow'
})

module.exports = {
	Flow
}
