const express = require("express");
const cors = require("cors");
require("dotenv").config(); 
const app = express();
const orderRoutes = require('./routes/order.routes')

const connectDb = require('./config/db')

const allowedOrigins = [
  "https://ecommerce-frontend-ruddy-kappa.vercel.app", // your deployed frontend
  "http://localhost:5173" // your local frontend for testing
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // optional if you're using cookies or authentication
}));

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
