const bcrypt = require('bcryptjs')
const { Sequelize, Model } = require('sequelize')
const { sequelize } = require('../../core/db')
const { NotFound, AuthFailed } = require('../../core/http-exception')

class User extends Model{
	// 登录
	static async verifyEmailPassword(email, plainPassword) {
		const user = await User.findOne({
			where: {
				email
			}
		})
		if (!user) {
			throw new NotFound('账号不存在')
		}
		const correct = bcrypt.compareSync(plainPassword, user.password)
		if (!correct) {
			throw new AuthFailed('密码不正确')
		}
		return user
	}
	// 获取openid
	static async getUserByOpenid(openid) {
		const user = await User.findOne({
			where: {
				openid
			}
		})
		return user
	}
	// openid登录
	static async registerByOpenid(openid) {
		const user =  await User.create({
			openid
		})
		return user
	}
}

User.init({
	// id: {
	// 	type: Sequelize.INTEGER,
	// 	primaryKey: true,
	// 	autoIncrement: true
	// },
	nickname: Sequelize.STRING,
	email: {
		type: Sequelize.STRING(128),
		unique: true
	},
	password: {
		type: Sequelize.STRING,
		set(val) {
			const salt = bcrypt.genSaltSync(10)
			const psw = bcrypt.hashSync(val, salt)
			this.setDataValue('password', psw)
		}
	},
	openid: {
		type: Sequelize.STRING(64),
		unique: true
	}
}, {
	sequelize,
	tableName: 'user'
})

module.exports = {
	User
}
