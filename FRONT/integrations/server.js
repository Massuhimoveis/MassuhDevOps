const express = require("express");
const { authenticate, getFieldOptionsData } = require("./googlesheets.js"); // Import the function
const app = express();
const PORT = process.env.PORT || 3000;

// Route to get "field_options" data from Google Sheets
app.get("/api/field-options", async (req, res) => {
  try {
    // Authenticate and retrieve data from "field_options" tab
    const auth = await authenticate();
    const fieldOptionsData = await getFieldOptionsData(auth);

    // Send the data as a JSON response
    res.status(200).json(fieldOptionsData);
  } catch (error) {
    console.error("Error fetching field_options:", error);
    res.status(500).send("Error fetching field_options data");
  }
});

// Starting the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
