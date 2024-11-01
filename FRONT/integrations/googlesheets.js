const express = require("express");
const cors = require("cors"); // Import cors middleware
const { google } = require("googleapis");
const { readFile } = require("fs").promises;

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());

// Service account authentication function
async function authenticate() {
  const credentials = await readFile("credentials.json");
  const parsedCredentials = JSON.parse(credentials);

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: parsedCredentials.client_email,
      private_key: parsedCredentials.private_key,
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"], // Access to Google Sheets
  });

  const authClient = await auth.getClient();
  return authClient;
}

// Function to get data from the "fields" and "field_options" tabs in Google Sheets
async function getFieldsData(auth) {
  console.log("Fetching data from Google Sheets...");
  const sheets = google.sheets({ version: "v4", auth });

  try {
    // Fetch data from the "fields" tab
    const fieldsResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: "1zDjWJLF4Rkmw5kpdGaoe0hierdWdOTb2FYvuoMhq1zo", // Replace with your actual spreadsheet ID
      range: "fields!A1:Z", // Adjust this range based on your sheet structure
    });

    // Fetch data from the "field_options" tab
    const fieldOptionsResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: "1zDjWJLF4Rkmw5kpdGaoe0hierdWdOTb2FYvuoMhq1zo", // Same spreadsheet ID
      range: "field_options!A1:C", // Adjust the range based on your tab structure
    });

    const fieldsRows = fieldsResponse.data.values;
    const fieldOptionsRows = fieldOptionsResponse.data.values;

    if (fieldsRows.length && fieldOptionsRows.length) {
      console.log(
        "Data retrieved from Google Sheets (fields tab):",
        fieldsRows
      );
      console.log(
        "Data retrieved from Google Sheets (field_options tab):",
        fieldOptionsRows
      );

      // Map the headers for the "fields" tab
      const fieldsHeaders = fieldsRows[0];
      const fieldsData = fieldsRows.slice(1).map((row) => {
        const entry = {};
        fieldsHeaders.forEach((header, index) => {
          entry[header] = row[index] || ""; // Handle missing values
        });
        return entry;
      });

      // Map the headers for the "field_options" tab
      const fieldOptionsHeaders = fieldOptionsRows[0];
      const fieldOptionsData = fieldOptionsRows.slice(1).map((row) => {
        const entry = {};
        fieldOptionsHeaders.forEach((header, index) => {
          entry[header] = row[index] || ""; // Handle missing values
        });
        return entry;
      });

      // Combine field options with fields based on the field label
      fieldsData.forEach((field) => {
        // For categorical fields, append the options
        if (field.column_type === "categorical") {
          const optionsForField = fieldOptionsData
            .filter((option) => option.field_label === field.column_name) // Match field options by the field label
            .map((option) => option.field_option); // Extract the option values

          field.field_options = optionsForField; // Add the options to the field entry
        }
      });

      console.log("Mapped Fields Data with Options:", fieldsData);
      return fieldsData;
    } else {
      console.log("No data found in one or both tabs.");
      return [];
    }
  } catch (error) {
    console.error("Error retrieving data from Google Sheets:", error);
  }
}

// Function to retrieve filtered data based on whether it should appear in Imóveis, Clientes, or both
async function getFieldOptionsByPage(pageType) {
  const auth = await authenticate();
  const data = await getFieldsData(auth);

  return data.filter((entry) => {
    const showInImoveis = entry["Info de Imóvel?"] === "TRUE";
    const showInClientes = entry["Info de Contato"] === "TRUE";

    if (pageType === "imoveis") {
      return showInImoveis;
    } else if (pageType === "clientes") {
      return showInClientes;
    } else if (pageType === "both") {
      return showInImoveis && showInClientes;
    }
    return false;
  });
}

// Endpoint to return filtered data
app.get("/api/fields-options", async (req, res) => {
  try {
    const pageType = req.query.page; // e.g. 'imoveis', 'clientes', or 'both'
    const fieldOptions = await getFieldOptionsByPage(pageType);
    res.json(fieldOptions);
  } catch (error) {
    console.error("Error fetching field options:", error);
    res.status(500).json({ error: "Failed to retrieve field options" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
