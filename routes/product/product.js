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
router.post('/save', upload.single('file'), (req, res, next) => {
	var files = req.file //文件对象
	var uploadedPath = files.path;//上传文件路径
	var dstPath = './public/upload/' + files.originalname;
	//重命名为真实文件名
	fs.rename(uploadedPath, dstPath, function(err) {
		if (err) {
			console.log('rename error: ' + err);
		} else {
			console.log('rename ok');
		}
	});
	
	let resultList = {
		productID:req.body.productID,
		productName:req.body.productName,
		productPic:files.originalname,
		price:req.body.price,
		counts:req.body.counts
	}
	console.log(resultList)
	Product.updateOne({productID:req.body.productID}, resultList, function(err, result){
		if(err) {
			console.log(err)
		} else {
			res.set('Content-Type','text/html');
			res.send(`<script>alert("修改成功");</script>`)
		}
	})
})

module.exports = router;
