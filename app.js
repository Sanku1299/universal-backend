const express = require("express");
const path = require("path");
const connectDB = require("./database");


const track = require("./routes/track");
const uploadJson = require("./routes/upload-json");
const uploadCsv = require("./routes/upload-csv");
const allData = require("./routes/all-data");

const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, "public")));

app.use("/", uploadJson);
app.use("/", uploadCsv);
app.use("/", track);
app.use("/", allData);

connectDB()
  .then(() => {
    console.log("Database connection established...");
  })
  .catch((err) => {
    console.error("Database cannot be connected!!");
  });

module.exports = app;