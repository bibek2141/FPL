const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();
const port = 3000;
app.use(cors());

// Existing endpoint for FPL data
app.get("/api/fpl-data", async (req, res) => {
  try {
    const response = await axios.get(
      "https://fantasy.premierleague.com/api/bootstrap-static/"
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching FPL data:", error);
    res.status(500).json({ error: "Failed to fetch FPL data" });
  }
});

// New endpoint for fixtures
app.get("/api/fixtures", async (req, res) => {
  try {
    const response = await axios.get(
      "https://fantasy.premierleague.com/api/fixtures/"
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching fixtures data:", error);
    res.status(500).json({ error: "Failed to fetch fixtures data" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
