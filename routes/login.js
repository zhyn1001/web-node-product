var express = require('express');
var router = express.Router();
var User = require('../models/user')
var bcrypt = require('bcrypt');

/* GET home page. */
router.get('/', function (req, res, next) {
	res.render('login');
});

router.post('/doLogin', function (req, res, next) {
    let _username = req.body.username
    let _password = req.body.password
    User.find({'username':_username},function(err,docs){
		if(err){
			res.send(500);
		}
		let doc = docs[0]
		if(docs.length==0){
			res.send('用户不存在');
		} else {
			if( bcrypt.compareSync(_password, doc.password) ){
				var _user = {username:doc.username}
                req.session.userInfo = _user;
				res.redirect('/');
			}else{
				res.send(`<script>alert('密码错误')</script>`);
			}
		}
	})
});

router.get('/logout', function(req, res, next){
    req.session.destroy()
    res.redirect('/login')
})

module.exports = router;