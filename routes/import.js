var express = require('express');
var router = express.Router();
var fs = require('fs');
var Product = require('../models/product')


/* 上传*/
router.post('/', function(req, res, next) {
	var files = req.files
	var inputFile = files[0];//文件对象
	var uploadedPath = inputFile.path;//上传文件路径
	var dstPath = './public/upload/' + inputFile.originalname;
	//重命名为真实文件名
	fs.rename(uploadedPath, dstPath, function(err) {
		if (err) {
			console.log('rename error: ' + err);
		} else {
			console.log('rename ok');
		}
	});
	Product.updateOne({productID:req.body.productID}, {productPic:inputFile.originalname}, function(err, result){
		if(err) {
			console.log(err)
		} else {
			res.json({'success':'AAA'})
		}
	})
});

module.exports = router;


/**
//生成multiparty对象，并配置上传目标路径
var form = new multiparty.Form({
	uploadDir: './public/upload/'
});
上传完成后处理
form.parse(req, function(err, fields, files) {
	var filesTmp = JSON.stringify(files, null, 2);

	if (err) {
		console.log('parse error: ' + err);
	} else {
		console.log(files)
		var inputFile = files.file[0];
		var uploadedPath = inputFile.path;
		var dstPath = './public/upload/' + inputFile.originalFilename;
		Product.updateOne({productID:req.body.productID}, {productPic:inputFile.originalFilename}, function(err, result){
			if(err) {
				console.log(err)
			} else {
				console.log(result)
				res.json({'success':'AAA'})
			}
		})
		//重命名为真实文件名
		fs.rename(uploadedPath, dstPath, function(err) {
			if (err) {
				console.log('rename error: ' + err);
			} else {
				console.log('rename ok');
			}
		});
	}
});
 */