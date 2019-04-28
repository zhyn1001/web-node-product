var express = require('express');
var router = express.Router();
var Product = require('../../models/product')
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
				producrList:docs[0]
			});
		}
	})
})
router.post('/save', (req, res, next) => {
	Product.updateOne({productID:req.body.productID}, req.body, function(err, result){
		if(err) {
			console.log(err)
		} else {
			res.set('Content-Type','text/html');
			res.send(`<script>alert("修改成功");history.back();</script>`)
		}
	})
})

module.exports = router;
