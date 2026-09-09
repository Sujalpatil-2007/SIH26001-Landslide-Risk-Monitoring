import {
  Activity,
  AlertTriangle,
  CloudRain,
  MapPin,
  ShieldCheck,
  TrendingUp,
  RefreshCw,
} from "lucide-react";

import { useEffect, useState } from "react";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { getLatestPrediction, getPredictions } from "../api/risk.api";

// =========================================================
// DASHBOARD
// =========================================================

function DashboardPage() {
  const [latestPrediction, setLatestPrediction] = useState(null);
  const [predictions, setPredictions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =======================================================
  // FETCH DASHBOARD DATA
  // =======================================================

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [latestData, predictionData] = await Promise.all([
        getLatestPrediction(),
        getPredictions(),
      ]);

      console.log("Latest prediction:", latestData);
      console.log("Prediction history:", predictionData);

      // ---------------------------------------------------
      // Latest prediction
      // ---------------------------------------------------

      if (latestData?.risk_score !== undefined) {
        setLatestPrediction(latestData);

        localStorage.setItem("latestPrediction", JSON.stringify(latestData));
      } else {
        setLatestPrediction(null);
      }

      // ---------------------------------------------------
      // Prediction history
      // ---------------------------------------------------

      if (Array.isArray(predictionData)) {
        setPredictions(predictionData);
      } else {
        setPredictions([]);
      }
    } catch (error) {
      console.error(
        "Dashboard API error:",
        error.response?.data || error.message,
      );

      // ---------------------------------------------------
      // Try cached latest prediction
      // ---------------------------------------------------

      const savedPrediction = localStorage.getItem("latestPrediction");

      if (savedPrediction) {
        try {
          const parsedPrediction = JSON.parse(savedPrediction);

          setLatestPrediction(parsedPrediction);

          setError("Backend unavailable. Showing the last saved prediction.");
        } catch (parseError) {
          console.error("Invalid saved prediction:", parseError);

          setError("Unable to load dashboard data.");
        }
      } else {
        setError("Unable to load dashboard data.");
      }
    } finally {
      setLoading(false);
    }
  };

  // =======================================================
  // INITIAL LOAD
  // =======================================================

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // =======================================================
  // LATEST PREDICTION
  // =======================================================

  const probability = Number(latestPrediction?.risk_score ?? 0) * 100;

  const riskLevel = latestPrediction?.risk_level || "No Data";

  const recommendation =
    latestPrediction?.recommendation ||
    "Run a prediction to receive an AI-generated recommendation.";

  // =======================================================
  // LOCATION
  // =======================================================

  const latitude =
    latestPrediction?.input?.latitude ?? latestPrediction?.latitude;

  const longitude =
    latestPrediction?.input?.longitude ?? latestPrediction?.longitude;

  const location =
    latitude !== undefined && longitude !== undefined
      ? `${latitude}, ${longitude}`
      : "Location unavailable";

  // =======================================================
  // TIMESTAMP
  // =======================================================

  const createdAt = latestPrediction?.created_at
    ? new Date(latestPrediction.created_at).toLocaleString()
    : null;

  // =======================================================
  // REAL STATISTICS
  // =======================================================

  const totalPredictions = predictions.length;

  const highRiskPredictions = predictions.filter((prediction) => {
    const level = prediction?.risk_level?.toLowerCase();

    return level === "high" || level === "very high";
  }).length;

  const veryHighPredictions = predictions.filter(
    (prediction) => prediction?.risk_level?.toLowerCase() === "very high",
  ).length;

  // =======================================================
  // RISK TREND DATA
  // =======================================================

  const riskTrendData = [...predictions].reverse().map((prediction, index) => ({
    name: prediction?.created_at
      ? new Date(prediction.created_at).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
        })
      : `Prediction ${index + 1}`,

    risk: Number(prediction?.risk_score ?? 0) * 100,
  }));

  // If there are no predictions
  const chartData =
    riskTrendData.length > 0
      ? riskTrendData
      : [
          {
            name: "No Data",
            risk: 0,
          },
        ];

  // =======================================================
  // RAINFALL TREND
  // =======================================================

  const rainfallTrendData = [...predictions]
    .reverse()
    .map((prediction, index) => ({
      name: prediction?.created_at
        ? new Date(prediction.created_at).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
          })
        : `Prediction ${index + 1}`,

      rainfall: Number(prediction?.input?.rainfall_24h_mm ?? 0),
    }));

  const rainfallChartData =
    rainfallTrendData.length > 0
      ? rainfallTrendData
      : [
          {
            name: "No Data",
            rainfall: 0,
          },
        ];

  // =======================================================
  // RISK BADGE
  // =======================================================

  const getRiskBadgeClass = () => {
    switch (riskLevel.toLowerCase()) {
      case "very high":
        return "border border-red-500/20 bg-red-500/10 text-red-400";

      case "high":
        return "border border-orange-500/20 bg-orange-500/10 text-orange-400";

      case "moderate":
        return "border border-yellow-500/20 bg-yellow-500/10 text-yellow-400";

      case "low":
        return "border border-[#b8e986]/20 bg-[#b8e986]/10 text-[#b8e986]";

      default:
        return "border border-white/10 bg-white/5 text-[#71817a]";
    }
  };

  // =======================================================
  // RISK COLOR
  // =======================================================

  const getRiskStroke = () => {
    switch (riskLevel.toLowerCase()) {
      case "very high":
        return "#ef4444";

      case "high":
        return "#f97316";

      case "moderate":
        return "#eab308";

      case "low":
        return "#b8e986";

      default:
        return "#71817a";
    }
  };

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <div className="min-h-screen bg-[#07110e] px-4 py-6 text-[#e8edf2] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-350">
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[2px] text-[#91b66e]">
              <Activity size={15} />
              Monitoring Dashboard
            </div>

            <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Landslide Risk Overview
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#7f918a]">
              Monitor current landslide risk, environmental conditions and
              early-warning activity across the North Eastern Region.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* REFRESH */}

            <button
              type="button"
              onClick={fetchDashboardData}
              disabled={loading}
              className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/3 px-3 py-2 text-xs text-[#899790] transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>

            {/* SYSTEM STATUS */}

            <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/3 px-3 py-2 text-xs text-[#899790]">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#b8e986]" />
              System operational
            </div>
          </div>
        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div
            className={`mb-6 rounded-xl border px-4 py-3 text-sm ${
              error.includes("unavailable")
                ? "border-yellow-500/20 bg-yellow-500/10 text-yellow-400"
                : "border-red-500/20 bg-red-500/10 text-red-400"
            }`}
          >
            {error}
          </div>
        )}

        {/* =================================================
            STAT CARDS
        ================================================= */}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={<MapPin size={21} />}
            title="Total Predictions"
            value={loading ? "--" : totalPredictions}
            change="Live"
            description="from MongoDB"
          />

          <StatCard
            icon={<AlertTriangle size={21} />}
            title="High Risk Predictions"
            value={loading ? "--" : highRiskPredictions}
            change={loading ? "--" : `${veryHighPredictions} very high`}
            description="currently detected"
            warning
          />

          <StatCard
            icon={<CloudRain size={21} />}
            title="Latest Rainfall"
            value={
              loading
                ? "--"
                : `${latestPrediction?.input?.rainfall_24h_mm ?? 0} mm`
            }
            change="24h"
            description="latest prediction input"
          />

          <StatCard
            icon={<ShieldCheck size={21} />}
            title="Latest Risk"
            value={loading ? "--" : `${probability.toFixed(2)}%`}
            change={loading ? "--" : riskLevel}
            description="latest prediction"
          />
        </div>

        {/* =================================================
            MAIN CONTENT
        ================================================= */}

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.7fr_1fr]">
          {/* =================================================
              RISK TREND
          ================================================= */}

          <section className="rounded-2xl border border-white/[0.07] bg-white/2.5 p-5 sm:p-6">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="font-display text-lg font-bold">Risk Trend</h2>

                <p className="mt-1 text-xs text-[#71817a]">
                  Prediction history from MongoDB
                </p>
              </div>

              <div className="rounded-lg bg-[#b8e986]/10 px-3 py-1.5 text-xs font-semibold text-[#b8e986]">
                Live Data
              </div>
            </div>

            <div className="h-70 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient
                      id="riskGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#b8e986"
                        stopOpacity={0.25}
                      />

                      <stop offset="100%" stopColor="#b8e986" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    stroke="rgba(255,255,255,0.06)"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "#71817a",
                      fontSize: 11,
                    }}
                  />

                  <YAxis
                    domain={[0, 100]}
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "#71817a",
                      fontSize: 11,
                    }}
                    tickFormatter={(value) => `${value}%`}
                  />

                  <Tooltip
                    contentStyle={{
                      background: "#0e1d18",
                      border: "1px solid rgba(255,255,255,.1)",
                      borderRadius: "10px",
                      color: "#fff",
                    }}
                    formatter={(value) => [
                      `${Number(value).toFixed(2)}%`,
                      "Risk",
                    ]}
                  />

                  <Area
                    type="monotone"
                    dataKey="risk"
                    stroke="#b8e986"
                    strokeWidth={2}
                    fill="url(#riskGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* =================================================
              CURRENT RISK
          ================================================= */}

          <section className="rounded-2xl border border-white/[0.07] bg-white/2.5 p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-lg font-bold">Current Risk</h2>

                <p className="mt-1 text-xs text-[#71817a]">
                  Latest prediction from AI model
                </p>
              </div>

              <TrendingUp size={20} className="text-[#b8e986]" />
            </div>

            <div className="mt-8 flex flex-col items-center">
              {/* RISK CIRCLE */}

              <div className="relative h-48 w-48">
                <div className="absolute inset-0 rounded-full border-12 border-white/5" />

                <div
                  className="absolute inset-0 rounded-full border-12 border-transparent"
                  style={{
                    borderTopColor: getRiskStroke(),

                    borderRightColor:
                      probability >= 50 ? getRiskStroke() : "transparent",

                    transform: `rotate(${probability * 2.7 - 45}deg)`,
                  }}
                />

                <div className="absolute inset-0 grid place-items-center">
                  <div className="text-center">
                    <div className="font-display text-4xl font-bold">
                      {loading ? "--" : `${probability.toFixed(2)}%`}
                    </div>

                    <div className="mt-1 text-xs text-[#81908a]">
                      Risk probability
                    </div>
                  </div>
                </div>
              </div>

              {/* RISK BADGE */}

              <div
                className={`mt-6 rounded-full px-4 py-2 text-sm font-semibold ${getRiskBadgeClass()}`}
              >
                {riskLevel === "No Data"
                  ? "No Prediction"
                  : `${riskLevel} Risk`}
              </div>

              {/* LOCATION */}

              <div className="mt-4 flex items-center gap-2 text-xs text-[#81908a]">
                <MapPin size={14} />

                <span>{location}</span>
              </div>

              {/* TIMESTAMP */}

              {createdAt && (
                <p className="mt-2 text-[10px] text-[#596761]">
                  Last updated: {createdAt}
                </p>
              )}

              {/* RECOMMENDATION */}

              <div className="mt-4 max-w-sm rounded-xl border border-white/5 bg-white/3 p-4">
                <p className="text-center text-[10px] font-semibold uppercase tracking-wider text-[#91b66e]">
                  AI Recommendation
                </p>

                <p className="mt-2 text-center text-xs leading-5 text-[#71817a]">
                  {recommendation}
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* =================================================
            RAINFALL
        ================================================= */}

        <section className="mt-6 rounded-2xl border border-white/[0.07] bg-white/2.5 p-5 sm:p-6">
          <div className="mb-6">
            <h2 className="font-display text-lg font-bold">
              Rainfall Monitoring
            </h2>

            <p className="mt-1 text-xs text-[#71817a]">
              Rainfall values from prediction inputs
            </p>
          </div>

          <div className="h-65 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={rainfallChartData}>
                <defs>
                  <linearGradient
                    id="rainfallGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#7dd3fc" stopOpacity={0.2} />

                    <stop offset="100%" stopColor="#7dd3fc" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  stroke="rgba(255,255,255,0.06)"
                  vertical={false}
                />

                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#71817a",
                    fontSize: 11,
                  }}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#71817a",
                    fontSize: 11,
                  }}
                  tickFormatter={(value) => `${value} mm`}
                />

                <Tooltip
                  contentStyle={{
                    background: "#0e1d18",
                    border: "1px solid rgba(255,255,255,.1)",
                    borderRadius: "10px",
                    color: "#fff",
                  }}
                  formatter={(value) => [`${value} mm`, "Rainfall"]}
                />

                <Area
                  type="monotone"
                  dataKey="rainfall"
                  stroke="#7dd3fc"
                  strokeWidth={2}
                  fill="url(#rainfallGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* =================================================
            RECENT ALERTS
        ================================================= */}

        <section className="mt-6 rounded-2xl border border-white/[0.07] bg-white/2.5 p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-bold">Recent Alerts</h2>

              <p className="mt-1 text-xs text-[#71817a]">
                Latest predictions stored in MongoDB
              </p>
            </div>

            <span className="text-xs font-semibold text-[#b8e986]">
              {predictions.length} records
            </span>
          </div>

          <div className="space-y-2">
            {predictions.length === 0 ? (
              <div className="rounded-xl border border-white/5 bg-black/10 p-8 text-center">
                <AlertTriangle size={28} className="mx-auto text-[#596761]" />

                <p className="mt-3 text-sm text-[#71817a]">
                  No predictions found.
                </p>

                <p className="mt-1 text-xs text-[#596761]">
                  Run a prediction to see it here.
                </p>
              </div>
            ) : (
              predictions
                .slice(0, 10)
                .map((prediction, index) => (
                  <AlertRow
                    key={prediction.created_at || index}
                    prediction={prediction}
                  />
                ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

// =========================================================
// STAT CARD
// =========================================================

function StatCard({
  icon,
  title,
  value,
  change,
  description,
  warning = false,
}) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/2.5 p-5 transition hover:border-white/[0.14]">
      <div className="flex items-start justify-between">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#b8e986]/10 text-[#b8e986]">
          {icon}
        </div>

        <span
          className={`text-xs font-semibold ${
            warning ? "text-[#fbbf55]" : "text-[#b8e986]"
          }`}
        >
          {change}
        </span>
      </div>

      <div className="mt-5">
        <p className="text-xs text-[#71817a]">{title}</p>

        <div className="mt-1 font-display text-2xl font-bold">{value}</div>

        <p className="mt-1 text-[11px] text-[#596761]">{description}</p>
      </div>
    </div>
  );
}

// =========================================================
// ALERT ROW
// =========================================================

function AlertRow({ prediction }) {
  const riskLevel = prediction?.risk_level || "Unknown";

  const normalizedLevel = riskLevel.toLowerCase();

  const probability = Number(prediction?.risk_score ?? 0) * 100;

  const latitude = prediction?.input?.latitude;

  const longitude = prediction?.input?.longitude;

  const location =
    latitude !== undefined && longitude !== undefined
      ? `${latitude}, ${longitude}`
      : "Unknown location";

  const createdAt = prediction?.created_at
    ? new Date(prediction.created_at).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Unknown time";

  const isVeryHigh = normalizedLevel === "very high";

  const isHigh = normalizedLevel === "high";

  const isModerate = normalizedLevel === "moderate";

  const iconClass = isVeryHigh
    ? "bg-red-500/10 text-red-400"
    : isHigh
      ? "bg-orange-500/10 text-orange-400"
      : isModerate
        ? "bg-yellow-500/10 text-yellow-400"
        : "bg-[#b8e986]/10 text-[#b8e986]";

  const badgeClass = isVeryHigh
    ? "bg-red-500/10 text-red-400"
    : isHigh
      ? "bg-orange-500/10 text-orange-400"
      : isModerate
        ? "bg-yellow-500/10 text-yellow-400"
        : "bg-[#b8e986]/10 text-[#b8e986]";

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-white/6 bg-black/10 p-4 transition hover:bg-white/3 sm:flex-row sm:items-center sm:justify-between">
      {/* LOCATION */}

      <div className="flex items-center gap-3">
        <div
          className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${iconClass}`}
        >
          <AlertTriangle size={18} />
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold">{location}</span>

            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${badgeClass}`}
            >
              {riskLevel}
            </span>
          </div>

          <p className="mt-1 text-[11px] text-[#64726d]">{createdAt}</p>
        </div>
      </div>

      {/* PROBABILITY */}

      <div className="flex items-center gap-6 pl-13 sm:pl-0">
        <div>
          <p className="text-[10px] text-[#64726d]">Probability</p>

          <p className="mt-1 text-sm font-bold">{probability.toFixed(2)}%</p>
        </div>

        <div className="h-8 w-px bg-white/10" />

        <span className="text-xs font-medium text-[#b8e986]">Active</span>
      </div>
    </div>
  );
}

export default DashboardPage;
