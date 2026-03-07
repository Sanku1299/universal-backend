const express = require("express");
const Shipment = require("../models/shipment");

const uploadJson = express.Router();

uploadJson.post("/upload-json", async (req, res) => {

  try {

    const shipments = req.body;

    if (!Array.isArray(shipments)) {
      return res.status(400).json({
        message: "Data must be an array of shipments"
      });
    }

    for (const row of shipments) {

      await Shipment.updateOne(
        { awb_no: row.awb_no },
        { $set: row },
        { upsert: true }
      );

    }

    res.json({
      message: "Bulk data uploaded successfully",
      inserted: shipments.length
    });

  } catch (err) {

    console.error("UPLOAD JSON ERROR:", err);

    res.status(500).json({
      message: "Error uploading JSON data",
      error: err.message
    });

  }

});

module.exports = uploadJson;