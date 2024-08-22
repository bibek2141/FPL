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

//FPL Manager
app.get("/api/entry/:id", async (req, res) => {
  const { id } = req.params;
  const url = `https://fantasy.premierleague.com/api/entry/${id}/`;
  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      res.status(404).json({ message: "ID not found" });
    } else {
      console.error("Error fetching FPL data:", error);
      res.status(500).json({ message: "Error fetching FPL data" });
    }
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
