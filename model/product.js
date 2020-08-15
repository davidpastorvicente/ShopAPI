var mng = require('mongoose');

var product = new mng.Schema({
  title: String,
  price: Number,
  likes: {type: Number, default:0},
  description: {type: String, default: "No description."}
});

module.exports = mng.model('Product', product);
