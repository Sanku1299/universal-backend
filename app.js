const express = require('express');
const connectDB = require("./database");
const opRouter = require("./routes/opRouter");

const app = express();
app.use(express.json());

const cors = require("cors");
app.use(cors());

app.use("/", opRouter);


connectDB()
    .then(() => {
        console.log("Database connection established...");
        app.listen(7777, () => {
            console.log("Server is successfully listening on port 7777...");
        });
    }).catch((err) => {
        console.error("Database cannot be connected!!");
    });