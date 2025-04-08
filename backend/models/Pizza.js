const mongoose = require('mongoose');

const pizzaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  base: { type: String, required: true },
  sauce: { type: String, required: true },
  cheese: { type: String, required: true },
  veggies: [String],
  meat: [String],
  price: { type: Number, required: true },
});

module.exports = mongoose.model('Pizza', pizzaSchema);