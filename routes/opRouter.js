const express = require("express");
const opRouter = express.Router();
const Shipment = require("../models/shipment");

const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");

const upload = multer({ dest: "uploads/" });

opRouter.post("/upload-csv", upload.single("file"), (req, res) => {

  // Check if file uploaded
  if (!req.file) {
    return res.status(400).send("No file uploaded");
  }

  // Validate CSV file
  if (!req.file.originalname.endsWith(".csv")) {
    return res.status(400).send("Only CSV files allowed");
  }

  const results = [];

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", async () => {

      try {

        const cleanedData = results.filter(row => row.awb_no);

        for (const row of cleanedData) {

          await Shipment.updateOne(
            { awb_no: row.awb_no },
            { $set: row },
            { upsert: true }
          );

        }

        fs.unlinkSync(req.file.path);

        res.json({
          message: "CSV processed successfully"
        });

      } catch (err) {

        console.error(err);

        res.status(500).json({
          message: "Database error",
          error: err.message
        });

      }

    });

});

opRouter.get("/track/:awb", async (req, res) => {

  const awb = req.params.awb;

  const shipment = await Shipment.findOne({ awb_no: awb });

  if (!shipment) {
    return res.json({ message: "AWB not found" });
  }

  res.json({
    awb: shipment.awb_no,
    pickup_date: shipment.pickup_date,
    from: shipment.from,
    to: shipment.to,
    status: shipment.status,
    delivery_date: shipment.delivery_date,
    delivery_time: shipment.delivery_time,
    recipient: shipment.recipient,
    reference_no: shipment.reference_no
  });

});

opRouter.get("/all-data", async (req, res) => {

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

opRouter.post("/upload-json", async (req, res) => {

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

module.exports = opRouter;