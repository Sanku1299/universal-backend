const mongoose = require('mongoose');

const connectDB = async () => { 
    await mongoose.connect("mongodb+srv://logistics:universal123@shipment.uuywqxb.mongodb.net/?appName=shipment"); 
}


module.exports = connectDB;