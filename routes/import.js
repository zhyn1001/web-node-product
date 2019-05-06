var express = require('express');
var router = express.Router();
var fs = require('fs');
var Product = require('../models/product')
var progressStream = require('progress-stream');
var multer = require('multer');
var upload = multer({ dest: './public/upload/' });//设置文件上传储存的目录，array为多文件上传，single为单文件上传

/* 上传*/
router.post('/progress', function(req, res, next) {

	// 创建progress stream的实例
    var progress = progressStream({length: '0'}); // 注意这里 length 设置为 '0'
    req.pipe(progress);
    progress.headers = req.headers;
    
    // 获取上传文件的真实长度（针对 multipart)
    progress.on('length', function nowIKnowMyLength (actualLength) {
        console.log('actualLength: %s', actualLength);
        progress.setLength(actualLength);
    });

    // 获取上传进度
    progress.on('progress', function (obj) {        
        console.log('progress: %s', obj.percentage);
    });

    // 实际上传文件
    upload.single('file')(progress, res, next);
});

router.post('/', upload.single('file'), function(req, res, next) {
	/**
	 * array():
	 * files
	 * [ { 
	 * 	fieldname: 'file',
		originalname: 'timg.jpg',
		encoding: '7bit',
		mimetype: 'image/jpeg',
		destination: './public/upload/',
		filename: '70e435da76675f48afbcc78ccc371c76',
		path: 'public\\upload\\70e435da76675f48afbcc78ccc371c76',
		size: 53636 
		} ]
	 */

	/**
	 * single:
	 * file:
	 * { fieldname: 'file',
		originalname: 'a3.png',
		encoding: '7bit',
		mimetype: 'image/png',
		destination: './public/upload/',
		filename: '8283142880deb8cc6af434e6a7ce8bbc',
		path: 'public\\upload\\8283142880deb8cc6af434e6a7ce8bbc',
		size: 28070 }
	 */
	var files = req.file
	var inputFile = files;//文件对象
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
})

module.exports = router;