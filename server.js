const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load environment variables from the .env file
dotenv.config();

const app = express();

// Use environment variable for MongoDB URI and set the default port
const PORT = process.env.PORT || 3000;

// Set the base URL for the application (for creating shareable links)
app.locals.baseUrl = process.env.BASE_URL;

// Connect to MongoDB using the connection string from environment variables
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Middleware to set EJS as the view engine
app.set("view engine", "ejs");

// Serve static files from the "public" directory
app.use(express.static("public"));

// Middleware to parse incoming requests with JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Link to the URL router
const urlRouter = require("./routes/urlRout");
app.use("/", urlRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
