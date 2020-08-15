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
  product.save(function(err, save) {
    if(err) res.status(500).send({error: 'Could not save'});
    else res.status(200).send(save);
  })
});

app.get('/product', function(req, res) {
  Product.find({}, function(err, save) {
    if(err) res.status(500).send({error: 'Could not display'});
    else res.status(200).send(save);
  });
});

app.listen(3000, function() {
  console.log("Store API running on port 3000...");
});
