const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config(); 
const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json()); 

const PORT = process.env.PORT || 5000;
const ATLAS_URI = process.env.ATLAS_URI;
if (!ATLAS_URI) {
  console.error(" ATLAS_URI is not set in environment. Add ATLAS_URI to your .env file.");
  process.exit(1);
}

mongoose
  .connect(ATLAS_URI)
  .then(() => console.log(" MongoDB Atlas connected"))
  .catch((err) => {
    console.error(" MongoDB connection error:", err);
    process.exit(1);
  });

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


app.get("/", (req, res) => {
  res.send("E-commerce Backend (MongoDB) is running");
});

app.post("/checkout", async (req, res) => {
  try {
    const { name, email, phone, address, total, items } = req.body;
    if (!name || typeof total === "undefined") {
      return res.status(400).json({ error: "Missing required fields: name and total" });
    }

    const newOrder = new Order({ name, email, phone, address, total, items });
    const saved = await newOrder.save();

    console.log("New Order saved:", saved);
    return res.status(201).json({ message: "Order placed successfully", order: saved });
  } catch (err) {
    console.error("Error saving order:", err);
    return res.status(500).json({ error: "Failed to save order" });
  }
});

app.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
