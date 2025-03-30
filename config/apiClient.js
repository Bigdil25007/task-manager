const axios = require("axios");

const PORT = process.env.PORT || 3000;

const apiClient = axios.create({
  baseURL: `http://localhost:${PORT}/api`,
});

module.exports = apiClient;
