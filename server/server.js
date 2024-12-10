// server/server.js
require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors"); // Import cors

const app = express();
app.use(express.json());

app.use(cors()); // Enable CORS for all routes by default

const PORT = process.env.PORT || 3001;

// Function to get access token
async function getAccessToken() {
  const tokenEndpoint = `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/v2.0/token`;
  const params = new URLSearchParams({
    client_id: process.env.CLIENT_ID,
    scope: "https://management.azure.com/.default",
    client_secret: process.env.CLIENT_SECRET,
    grant_type: "client_credentials",
  });

  const response = await axios.post(tokenEndpoint, params.toString(), {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  return response.data.access_token;
}

// Route to get pipeline status
app.get("/api/pipelines", async (req, res) => {
  try {
    console.log("Getting pipelines...");
    console.log("SUBSCRIPTION_ID:", process.env.SUBSCRIPTION_ID);
    console.log("RESOURCE_GROUP_NAME:", process.env.RESOURCE_GROUP_NAME);
    console.log("FACTORY_NAME:", process.env.FACTORY_NAME);

    const token = await getAccessToken();
    console.log("Token obtained:", token ? "Yes" : "No");

    const url = `https://management.azure.com/subscriptions/${process.env.SUBSCRIPTION_ID}/resourceGroups/${process.env.RESOURCE_GROUP_NAME}/providers/Microsoft.DataFactory/factories/${process.env.FACTORY_NAME}/pipelines?api-version=2018-06-01`;
    console.log("URL:", url);

    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching pipelines:", error?.response?.data || error);
    res.status(500).json({ error: "Failed to fetch pipelines" });
  }
});

// Route to run a pipeline
app.post("/api/runPipeline", async (req, res) => {
  const { pipelineName } = req.body;

  if (!pipelineName) {
    return res
      .status(400)
      .json({ error: "Missing required body parameter: pipelineName" });
  }

  try {
    const token = await getAccessToken();
    const url = `https://management.azure.com/subscriptions/${process.env.SUBSCRIPTION_ID}/resourceGroups/${process.env.RESOURCE_GROUP_NAME}/providers/Microsoft.DataFactory/factories/${process.env.FACTORY_NAME}/pipelines/${pipelineName}/createRun?api-version=2018-06-01`;

    const response = await axios.post(
      url,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error running pipeline:", error?.response?.data || error);
    res.status(500).json({ error: "Failed to run pipeline" });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
