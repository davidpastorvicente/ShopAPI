var mng = require('mongoose');

var wishlist = new mng.Schema({
  title: {type: String, default: "Wishlist"},
  products: [{type: mng.Schema.Types.ObjectId, ref: 'Product'}]
});

module.exports = mng.model('Wishlist', wishlist);
