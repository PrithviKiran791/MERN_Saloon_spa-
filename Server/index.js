const express = require('express');
const app = express();
const dotenv = require("dotenv");
const path = require('path');
const cors = require('cors');
const connectMongoDB = require("./config/mongodb-config.js");
var cookieParser = require('cookie-parser');

// load .env located next to this file (Server/.env), regardless of process.cwd()
dotenv.config({ path: path.join(__dirname, '.env') });

connectMongoDB();

app.use(express.json());
app.use(cookieParser())
// Configure CORS - Simple version
app.use(cors({
    origin: 'http://localhost:5174',
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
}));

// Load routes
const userRoute = require("./routes/user-routes");

app.use("/api/users", userRoute);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Node js + Express Server js is running on port ${port}`)
});