const express = require("express");
const uploadCsv = express.Router();
const Shipment = require("../models/shipment");

const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");

const upload = multer({ dest: "uploads/" });

uploadCsv.post("/upload-csv", upload.single("file"), (req, res) => {

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

module.exports = uploadCsv;