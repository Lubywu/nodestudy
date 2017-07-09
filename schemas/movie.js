var mongoose = require('mongoose');

var MovieSchema = new mongoose.Schema({
	doctor: String,
	title: String,
	language: String,
	country: String,
	summary: String,
	flash: String,
	poster: String,
	year: String,
	meta: {
		createAt: {
			type: Date,
			default: Date.now()
		},
		updateAt: {
			type: Date,
			default: Date.now()
		}
	}
	
});

// 每次保存数据前都会先执行这里的方法
MovieSchema.pre('save', function(next){
	// 如果是新录入电影则是创建时间和更新时间相同
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		// 如果是更新电影信息则是 updateAt
		this.meta.updateAt = Date.now();
	}
	// 继续往下执行
	next();
});

MovieSchema.statics = {
	// 获取所有数据
	fetch: function(cb){
		return this
			.find({})
			.sort('meta.updateAt')
			.exec(cb);
	},
	// 根据ID查询单条数据
	findById: function(id, cb){
		return this
			.findOne({_id: id})
			.exec(cb);
	}
}

// 导出模型
module.exports = MovieSchema;











