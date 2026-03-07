const connectDB = require("../database");
const Shipment = require("../models/shipment");

module.exports = async (req, res) => {
    await connectDB();
    try {
        const shipments = await Shipment.find({});
        res.json(shipments);

    } catch (err) {
        res.status(500).json({
            message: "Error fetching shipments",
            error: err.message
        });
    }
};