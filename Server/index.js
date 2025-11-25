const express = require('express');
const app = express();
const dotenv = require("dotenv");
const connectMongoDB = require("config\mongodb-config.js");
dotenv.config();

connectMongoDB();

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Node js + Express Server js is running on port ${port}`)
});