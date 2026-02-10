require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const searchRouter = require("./routes/search");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ status: "ok", message: "Fuzzy search API" });
});

app.use("/api/search", searchRouter);

const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/fuzzy_search_demo";

async function start() {
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server", err);
    process.exit(1);
  }
}

start();
