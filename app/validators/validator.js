const { LinValidator, Rule } = require('../../core/lin-validator-v2')
const { User } = require('../models/user')
const {LoginType, ArtType} = require('../lib/enum')

class PositiveInterValidator extends LinValidator{
	constructor() {
		super()
		this.id = [
			new Rule('isInt', '需要正整数', {min: 1})
		]
	}
}

class RegisterValidator extends LinValidator{
	constructor() {
		super()
		this.email = [
			new Rule('isEmail', '不符合Email规范')
		]
		this.password1 = [
			new Rule('isLength', '密码最少6个字符，最多32个字符', {
				min: 6,
				max: 32
			}),
			new Rule('matches', '密码不符合规范', '^(?![0-9]+$)(?![a-zA-Z]+$)[0-9a-zA-Z]')
		]
		this.password2 = this.password1
		this.nickname = [
			new Rule('isLength', '昵称不符合规范', {
				min: 4,
				max: 32
			})
		]
	}

	validatePassword(values) {
		const {password1, password2} = values.body
		if (password1 !== password2){
			throw new Error('两个密码必须相同')
		}
	}

	async validateEmail(vals) {
		const { email } = vals.body
		const user = await User.findOne({
			where: {
				email
			}
		})
		if (user) {
			throw new Error('email已存在')
		}
	}
}

class TokenValidator extends LinValidator{
	constructor() {
		super()
		this.account = [
			new Rule('isLength', '不符合账号规则', {
				min: 4,
				max: 32
			})
		]
		this.secret = [
			new Rule('isOptional'),
			new Rule('isLength', '至少6个字符', {
				min: 6,
				max: 128
			})
		]
	}
	validateLoginType(values) {
		if (!values.body.type) {
			throw new Error('type是必须参数')
		}
		if (!LoginType.isThisType(values.body.type)) {
			throw new Error('type参数不合法')
		}
	}
}

// token 不为空
class NotEmptyValidator extends LinValidator{
	constructor() {
		super()
		this.token = [
			new Rule('isLength', '不允许为空', {min:1})
		]
	}
}

// type 的封装，代替两个相似度高的函数
class Checker {
	constructor(type) {
		this.enumType = type
	}

	check(values) {
		let type = values.body.type || values.path.type

		if (!type) {
			throw new Error('type是必须参数')
		}
		type = parseInt(type)
		// this.parsed.path.type = type // 转换
		if (!this.enumType.isThisType(type)) {
			throw new Error('type参数不合法')
		}
	}
}

function checkLoginType(values) {
	let type = values.body.type
	if (!type) {
		throw new Error('type是必须参数')
	}
	type = parseInt(type)
	if (!LoginType.isThisType(type)) {
		throw new Error('type参数不合法')
	}
}

// 点赞
class LikeValidator extends PositiveInterValidator{
	constructor() {
		super()
		// const checker = new Checker(LoginType)
		// this.validateType = checker.check.bind(checker)
		this.validateType = checkLoginType
	}
}

function checkArtType(values) {
	let type = values.path.type
	if (!type) {
		throw new Error('type是必须参数')
	}
	type = parseInt(type)
	if (!ArtType.isThisType(type)) {
		throw new Error('type参数不合法')
	}
}

class ClassicValidator extends PositiveInterValidator{
	constructor() {
		super()
		// const checker = new Checker(ArtType)
		// this.validateType = checker.check.bind(checker)
		this.validateType = checkArtType
	}
}

class SearchValidator extends LinValidator{
	constructor(){
		super()
		this.q = [
			new Rule('isLength', '搜索关键字不能为空', {
				min: 1,
				max: 16
			})
		]
		this.start = [
			new Rule('isInt', 'start不符合规范', {min: 0, max: 10000}),
			new Rule('isOptional', '', 0)
		]
		this.count = [
			new Rule('isInt', 'count不符合规范', {min: 1, max: 20}),
			new Rule('isOptional', '', 20)
		]
	}
}

class AddSortCommentValidator extends PositiveInterValidator {
	constructor(){
		super()
		this.content = [
			new Rule('isLength', '必须在1到24个字符之间', {min: 1, max: 24})
		]
	}
}

module.exports = {
	PositiveInterValidator,
	RegisterValidator,
	TokenValidator,
	NotEmptyValidator,
	LikeValidator,
	ClassicValidator,
	SearchValidator,
	AddSortCommentValidator
}
