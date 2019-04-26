var express = require('express');
var router = express.Router();
var User = require('../models/user')
var bcrypt = require('bcrypt');
var salt = bcrypt.genSaltSync(10);//设置加密强度

/* GET home page. */
router.get('/', function (req, res, next) {
	res.render('register');
});
router.post('/', function(req, res, next){
    User.find(req.body,(err, docs) => {
        if(err){
            res.send(500)
        } else if(docs.length >0 ) {
            res.send('用户已存在')
        } else {
            var user = new User({
				username:req.body.username,
				password:bcrypt.hashSync(req.body.password,salt),
				publishTime:new Date()
			})
			user.save(function(err){
				if(!err){
					console.log('save status:', err ? 'failed' : 'success');
				}
            })
            res.send(`<div>注册成功<a href="/">返回首页</><span>3</span>秒后跳转到首页</div>`);
        }
    })
})

module.exports = router;