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
		if(docs){
			res.render('modify', {
				title: '修改商品',
				producrList:docs
			});
		}
	})
})
router.post('/save', (req, res, next) => {

})

module.exports = router;
