var express = require('express');
var router = express.Router();
var Product = require('../../models/product')
var multiparty = require('multiparty');
var util = require('util');
var fs = require('fs');
var multer = require('multer');
var upload = multer({ dest: './public/upload/' });//设置文件上传储存的目录，array为多文件上传，single为单文件上传
var modelback = {
	_id:0
}

/* GET home page. */
router.get('/', function (req, res, next) {
	Product.find({}, modelback, (err, docs) => {
		if(docs){
			res.render('product', {
				title: '商品管理',
				producrList:docs
			});
		}
	})
});
router.get('/addpage', function(req, res, next){
	res.render('addpage',{
		title: '增加商品'
	})
})
router.get('/modify/:productID', (req, res, next) => {
	Product.find({productID:req.params.productID}, modelback, (err, docs) => {
		if(docs && docs.length === 1){
			res.render('modify', {
				title: '修改商品',
				productList:docs[0]
			});
		}
	})
})
//新增/编辑
router.post('/save', upload.single('file'), (req, res, next) => {
	let productType = req.body.pType;
	let picUrl = false;
	if(req.file){
		var files = req.file //文件对象
		var uploadedPath = files.path;//上传文件路径
		var dstPath = './public/upload/' + files.originalname;
		picUrl = files.originalname
		//重命名为真实文件名
		fs.rename(uploadedPath, dstPath, function(err) {
			if (err) {
				console.log('rename error: ' + err);
			} else {
				console.log('rename ok');
			}
		});
	}
	let resultList = null;
	let paramArr = ['productID','productName','productPic','price']
	if(picUrl){
		resultList = {
			productID:req.body.productID ? req.body.productID : randomCode(),
			productName:req.body.productName,
			productPic:picUrl,
			price:req.body.price,
			counts:req.body.counts
		}
	} else {
		resultList = {
			productID:req.body.productID ? req.body.productID : randomCode(),
			productName:req.body.productName,
			price:req.body.price,
			counts:req.body.counts
		}
	}
	if(productType === 'modify') {
		Product.updateOne({productID:req.body.productID}, resultList, function(err, result){
			if(err) {
				console.log(err)
			} else {
				res.set('Content-Type','text/html');
				res.send(`<script>alert("修改成功");</script>`)
			}
		})
	} else if(productType === 'add'){
		var pdt = new Product({
			productID:randomCode(),
			productName:req.body.productName,
			productPic:picUrl,
			price:req.body.price,
			counts:req.body.counts
		})
		pdt.save(function(err, result){
			if(err) {
				console.log(err)
			} else {
				res.set('Content-Type','text/html');
				res.send(`<script>alert("新增成功");</script>`)
			}
		})
	}
})

function randomCode(){
	let reg = [0,1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',
	'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
	let str = '';
	let len = 8;
	for(let i=0; i<len; i++){
		let pos = Math.round(Math.random() * (reg.length-1))
		str += reg[pos]
	}
	return str;
}
module.exports = router;
