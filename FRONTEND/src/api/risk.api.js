import axios from "axios";

// =====================================================
// RISK API CLIENT
// =====================================================

const riskApi = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// =====================================================
// PREDICT RISK
// =====================================================

export const predictRisk = async (data) => {
  const response = await riskApi.post("/api/risk", data);

  return response.data;
};

// =====================================================
// GET ALL PREDICTIONS
// =====================================================

export const getPredictions = async () => {
  const response = await riskApi.get("/api/predictions");

  return response.data;
};

// =====================================================
// GET LATEST PREDICTION
// =====================================================

export const getLatestPrediction = async () => {
  const response = await riskApi.get("/api/predictions/latest");

  return response.data;
};

// =====================================================
// HEALTH CHECK
// =====================================================

export const getRiskApiHealth = async () => {
  const response = await riskApi.get("/health");

  return response.data;
};

export default riskApi;
