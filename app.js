require('dotenv').config();
const express = require('express');
const connectDB = require("./database");
const opRouter = require("./routes/opRouter");

const app = express();
app.use(express.json());

const cors = require("cors");
app.use(cors());

app.use("/api", opRouter);

const PORT = process.env.PORT || 7777;
const path = require("path");

connectDB()
    .then(() => {
        console.log("Database connection established...");
        app.listen(PORT, () => {
            console.log(`Server is successfully listening on port ${PORT}...`);
        });
    }).catch((err) => {
        console.error("Database cannot be connected!!", err);
    });

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});