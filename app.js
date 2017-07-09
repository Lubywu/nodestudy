// express 是node.js的web框架
var express = require('express');
// path 是配置项目的静态资源路径，在link 里或者 script 里路径写public 下的文件夹就行
// 
var path = require('path');
// underscore 跟merge 很类似，新的字段替换旧的字段 _.extend(newMovie, movie);
var _ = require('underscore');
// process 用于处理与当前进程相关的事情，是一个全局变量，global是一个全局对象全局变量是全局对象的属性
var port = process.env.PORT || 3001;
// bodyParser 是为了表单的 name="movie[title]"
var bodyParser = require('body-parser');
var app = express();
// mongoose 可以对mongodb进行建模
var mongoose = require('mongoose');
var Movie = require('./models/models');
// 连接本地数据库imooc
mongoose.connect('mongodb://localhost/imooc');
// 设置全局变量 moment，在jade文件可以使用 moment().format() 来格式化时间
app.locals.moment = require('moment');
// 设置渲染的前端页面文件路径
app.set('views', './views/pages');
// 渲染的前台页面类型
app.set('view engine', 'jade');
// 前台页面表单提交所用，对表单数据进行格式化
// 如果需要将输入框的name 变为对象的形式可取则设置为true
// req.body.movie.title
// 设置为 extended 为true，后端就可以通过 req.body.movie 对象拿到每个input 输入的内容
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

/*
通过 Express 内置的 express.static 可以方便地托管静态文件，例如图片、CSS、JavaScript 文件等。
将静态资源文件所在的目录作为参数传递给 express.static 中间件就可以提供静态资源文件的访问了。
注意：express 4.x版本之后值保留了express.static这个方法，其他方法都分为中间件另外安装引入
*/
app.use(express.static(path.join(__dirname, 'public')));



app.get('/', function(req, res){
	Movie.fetch(function(err, movies){
		if(err){
			console.log(err);
		}
		res.render('index', {
			title: '首页',
			movies: movies
		});

	});
});

app.get('/admin/create', function(req, res){
	res.render('admin', {
		title: '后台页',
		movie: {
			title: '',
			doctor: '',
			country: '',
			year: '',
			poster: '',
			flash: '',
			summary: '',
			language: ''
		}
	});
})

// 表单提交数据的接口
app.post('/admin/movie/new', function(req, res){
	/*
	POST提交的参数可以通过 req.body 拿到表单的数据
	这里有movie 这个对象是因为 bodyParser 的原因
	表单 input 的 name="movie[_id]"
	 */
	var id = req.body.movie._id;
	var movieObj = req.body.movie;
	var _movie;

	// 如果存在 id， 则是更新电影资讯
	//  != null 类似于 !=null && != undefined
	if(id !== 'undefined'){
		Movie.findById(id, function(err, movie){
			if(err){
				console.log(err);
			}
			_movie = _.extend(movie, movieObj);
			_movie.save(function(err, movie){
				if(err){
					console.log(err);
				}
				res.redirect('/admin/list');
			});
		});
	}else{
		// 新录入电影
		_movie = new Movie({
			doctor: movieObj.doctor,
			title: movieObj.title,
			country: movieObj.country,
			language: movieObj.language,
			year: movieObj.year,
			poster: movieObj.poster,
			summary: movieObj.summary,
			flash: movieObj.flash
		});
		_movie.save(function(err, movie){
			if(err){
				console.log(err);
			}
			res.redirect('/admin/list');
		})
	}
});

app.get('/admin/list', function(req, res){
	Movie.fetch(function(err, movies){
		if(err){
			console.log(err);
		}
		res.render('index', {
			title: '列表页',
			movies: movies
		});

	});
})

app.get('/movie/list', function(req, res){
	Movie.fetch(function(err, movies){
		if(err){
			console.log(err);
		}
		res.render('list', {
			title: '列表页',
			movies: movies
		});
	});
});

app.get('/movie/:id', function(req, res){
	var id = req.params.id;
	Movie.findById(id, function(err, movie){
		if(err){
			console.log(err);
		}
		res.render('detail', {
			title: movie.title + '详情页',
			movie: movie
		});
		
	});
});

// 添加更新按钮跳转到录入页
app.get('/admin/update/:id', function(req, res){
	// get 请求一般参数显示在 url 里，可以通过 req.params 拿到参数
	var id = req.params.id;
	if(id){
		Movie.findById(id, function(err, movie){
			res.render('admin', {
				title: movie.title + '更新页',
				movie: movie
			});
		});
	}
});

// 删除的接口
app.delete('/movie/delete', function(req, res){
	// POST或者DELETE 提交的URL的参数可以通过 req.query 拿到参数
	var id = req.query.id;
	if(id){
		Movie.remove({_id: id}, function(err, result){
			if(err){
				console.log(err);
			}else{
				res.json({success: true});
			}

		});
	}
});



app.listen(port);
console.log('server start on ' + port);













