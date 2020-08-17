var mng = require('mongoose');

var product = new mng.Schema({
  title: String,
  price: Number,
  likes: {type: Number, default: 0},
  url: {type: String, default:"https://png.pngtree.com/png-vector/20190614/ourlarge/pngtree-carecaringhandleproductresponsibility-abstract-circle-ba-png-image_1476969.jpg"},
  description: {type: String, default: "No description."}
});

module.exports = mng.model('Product', product);
