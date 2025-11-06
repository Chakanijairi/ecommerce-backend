const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: String,
  phone: String,
  address: String,
  items: { type: Array, default: [] }, 
  total: Number,
  status: { type: String, default: "Order received, preparing for shipment" },
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order

