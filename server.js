var app = require('express')();
var bp = require('body-parser');
var mng = require('mongoose');
var db = mng.connect('mongodb://localhost/shop')

var Product = require('./model/product');
var Wishlist =  require('./model/wishlist');

app.use(bp.json());
app.use(bp.urlencoded({extended: false}));

app.post('/product', function(req, res) {
  var product = new Product(req.body);
  product.save(function(err, prod) {
    if(err) res.status(500).send({error: 'Could not save'});
    else res.status(200).send(prod);
  })
});

app.get('/product', function(req, res) {
  Product.find({}, function(err, prod) {
    if(err) res.status(500).send({error: 'Could not display'});
    else res.status(200).send(prod);
  });
});

app.post('/wishlist', function(req, res) {
  var wishlist = new Wishlist();
  wishlist.title = req.body.title;
  wishlist.save(function(err, wish) {
    if(err) res.status(500).send({error: 'Could not save'});
    else res.status(200).send(wish);
  });
});

app.get('/wishlist', function(req, res) {
  Wishlist.find({}).populate({path: 'products', model: 'Product'}).exec(function(err, wish) {
    if(err) res.status(500).send({error: 'Could not display'});
    else res.status(200).send(wish);
  });
});

app.put('/wishlist/add', function(req, res) {
  Product.findOne({_id: req.body.productId}, function(err, prod) {
    if(err) res.status(500).send({error: 'Could not find the product'});
    else Wishlist.update({_id: req.body.wishlistId}, {$addToSet: {products: prod._id}}, function(err, wish) {
      if(err) res.status(500).send({error: 'Could not find the wishlist'});
      else res.status(200).send(wish);
    });
  });
});

app.listen(3000, function() {
  console.log("Store API running on port 3000...");
});
