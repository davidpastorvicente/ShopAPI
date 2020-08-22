var app = require('express')();
var bp = require('body-parser');
var mng = require('mongoose');
var cors = require('cors');
var db = mng.connect('mongodb://localhost/shop');

var Product = require('./model/product');
var Wishlist =  require('./model/wishlist');

app.use(cors());
app.use(bp.json());
app.use(bp.urlencoded({extended: false}));

app.post('/product', function(req, res) {
  var product = new Product(req.body);
  product.save(function(err, prod) {
    if(err) res.status(500).send({error: 'Could not save the product'});
    else res.status(200).send(prod);
  })
});

app.get('/product', function(req, res) {
  Product.find({}, function(err, prod) {
    if(err) res.status(500).send({error: 'Could not display the product'});
    else res.status(200).send(prod);
  });
});

app.post('/wishlist', function(req, res) {
  var wishlist = new Wishlist();
  wishlist.title = req.body.title;
  wishlist.save(function(err, wish) {
    if(err) res.status(500).send({error: 'Could not save the wishlist'});
    else res.status(200).send(wish);
  });
});

app.get('/wishlist', function(req, res) {
  Wishlist.find({}).populate({path: 'products', model: 'Product'}).exec(function(err, wish) {
    if(err) res.status(500).send({error: 'Could not display the wishlist'});
    else res.status(200).send(wish);
  });
});

app.delete('/wishlist', function(req, res) {
  Wishlist.deleteOne({_id: req.body.wishlistId}, function(err, wish) {
    if(err) res.status(500).send({error: 'Could not delete the wishlist'});
    else res.status(200).send(wish);
  });
});

app.put('/wishlist/add', function(req, res) {
  Product.findOne({_id: req.body.productId}, function(err, prod) {
    if(err) res.status(500).send({error: 'Could not find the product'});
    else Wishlist.findOne({_id: req.body.wishlistId}, function(err, wish) {
      if(err) res.status(500).send({error: 'Could not find the wishlist'});
      else wish.update({$addToSet: {products: prod._id}}, function(err, resp) {
        if(err) res.status(500).send({error: 'Could not add the product'});
        else res.status(200).send(resp);
      });
    });
  });
});

app.delete('/wishlist/del', function(req, res) {
  Wishlist.findOne({_id: req.body.wishlistId}, function(err, wish) {
    if(err) res.status(500).send({error: 'Could not find the wishlist'});
    else wish.update({$pull: {products: req.body.productId}}, function(err, resp) {
      if(err) res.status(500).send({error: 'Could not delete the product'});
      else res.status(200).send(resp);
    });
  });
});

app.listen(3001, function() {
  console.log("Store API running on port 3001...");
});
