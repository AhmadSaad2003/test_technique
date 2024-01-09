const express = require("express");
const connectToDB = require("./config/db");
const cookieparser  = require("cookie-parser");
require("dotenv").config();

//connection to database
connectToDB();

// Init App
const app = express();

app.use(express.json());

//to understand the data sent by the post methode
app.use(express.urlencoded({ extended: false }));

app.use(cookieparser());

// Set View Engine
app.set('view engine', 'ejs');

// Routes
app.use("/user", require("./routes/users"));

// Running The Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));