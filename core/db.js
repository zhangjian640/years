const { Sequelize, Model } = require('sequelize')
const { clone, isArray, unset } = require('lodash')
const {
	dbName,
	host,
	port,
	user,
	password
} = require('../config/config').dataBase

const sequelize = new Sequelize(dbName, user, password, {
	dialect: 'mysql',
	host,
	port,
	logging: true,
	timezone: '+08:00',
	define: {
		createdAt: 'created_at',
		updatedAt: 'updated_at',
		deletedAt: 'deleted_at',
		// paranoid: true, // 增加 deleted_at
		underscored: true, // 下划线命名
		scopes: {
			bh: {
				attributes: {
					exclude: ['created_at', 'updated_at', 'deleted_at']
				}
			}
		}
	}
})

sequelize.sync({
	force: false
})

Model.prototype.toJSON = function () {
	let data = clone(this.dataValues)

	for (key in data) {
		if (key === 'image' ) {
			if (!data[key].startsWith('http')) {
				data[key] = global.config.host + data[key]
			}
		}
	}

	if (isArray(this.exclude)) {
		this.exclude.forEach(value => {
			unset(data, value)
		})
	}
	return data
}

module.exports = {
	sequelize
}
