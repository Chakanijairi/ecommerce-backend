const express = require("express");
const cors = require("cors");
require("dotenv").config(); 
const app = express();
const orderRoutes = require('./routes/order.routes')

const connectDb = require('./config/db')

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json()); 

const PORT = process.env.PORT || 5000;

app.use('/api/order', orderRoutes)

app.get('/', (req, res) => {
  res.send("Hello world")
})

app.listen(PORT, () => {
  connectDb();
  console.log(`Server running on http://localhost:${PORT}`)
});
