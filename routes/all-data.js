const express = require("express");
const Shipment = require("../models/shipment");

const allData = express.Router();

allData.get("/all-data", async (req, res) => {

    try {
        const shipments = await Shipment.find({});
        res.json(shipments);

    } catch (err) {
        res.status(500).json({
            message: "Error fetching shipments",
            error: err.message
        });
    }
});

module.exports = allData;