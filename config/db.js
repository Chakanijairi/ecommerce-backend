const mongoose = require('mongoose')
const dotenv = require('dotenv').config()

const connectDb = () => {
    try{
        mongoose.connect(process.env.ATLAS_URI || "mongodb+srv://chawkani:jairi@school.klwdw9y.mongodb.net/ecommerceDB?retryWrites=true&w=majority")
        console.log('Mongodb is connected')
    } catch(error){
        console.error(" MongoDB connection error:", err);
        process.exit(1);
    }
}

module.exports = connectDb