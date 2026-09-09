import React, { useEffect, useMemo, useState } from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
} from "react-leaflet";

import {
  AlertTriangle,
  MapPin,
  ShieldCheck,
  Activity,
  RefreshCw,
} from "lucide-react";

import "leaflet/dist/leaflet.css";
import L from "leaflet";

import { getPredictions } from "../api/risk.api";

// =====================================================
// LEAFLET MARKER FIX
// =====================================================

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// =====================================================
// NORTHEAST INDIA BOUNDS
// =====================================================

const NER_BOUNDS = {
  minLatitude: 21.5,
  maxLatitude: 29.5,
  minLongitude: 88.0,
  maxLongitude: 97.5,
};

// =====================================================
// CHECK NER LOCATION
// =====================================================

const isInsideNER = (latitude, longitude) => {
  return (
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= NER_BOUNDS.minLatitude &&
    latitude <= NER_BOUNDS.maxLatitude &&
    longitude >= NER_BOUNDS.minLongitude &&
    longitude <= NER_BOUNDS.maxLongitude
  );
};

// =====================================================
// RISK CONFIGURATION
// =====================================================

const riskConfig = {
  LOW: {
    label: "Low",
    text: "text-[#b8e986]",
    bg: "bg-[#b8e986]/10",
    border: "border-[#b8e986]/20",
    fill: "#b8e986",
  },

  MODERATE: {
    label: "Moderate",
    text: "text-yellow-400",
    bg: "bg-yellow-400/10",
    border: "border-yellow-400/20",
    fill: "#facc15",
  },

  HIGH: {
    label: "High",
    text: "text-orange-400",
    bg: "bg-orange-400/10",
    border: "border-orange-400/20",
    fill: "#f97316",
  },

  "VERY HIGH": {
    label: "Very High",
    text: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    fill: "#dc2626",
  },
};

// =====================================================
// NORMALIZE RISK
// =====================================================

const normalizeRisk = (risk) => {
  const value = String(risk || "")
    .trim()
    .toUpperCase();

  if (value === "VERY HIGH") {
    return "VERY HIGH";
  }

  if (value === "HIGH") {
    return "HIGH";
  }

  if (value === "MODERATE") {
    return "MODERATE";
  }

  if (value === "LOW") {
    return "LOW";
  }

  return "LOW";
};

// =====================================================
// MAP UPDATER
// =====================================================

function MapUpdater({ locations }) {
  const map = useMap();

  useEffect(() => {
    if (!locations.length) {
      map.setView([25.8, 93.0], 7);
      return;
    }

    const bounds = L.latLngBounds(
      locations.map((location) => location.position),
    );

    map.fitBounds(bounds, {
      padding: [60, 60],
      maxZoom: 9,
    });
  }, [locations, map]);

  return null;
}

// =====================================================
// MAIN COMPONENT
// =====================================================

function RiskMapPage() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ===================================================
  // FETCH PREDICTIONS
  // ===================================================

  const fetchPredictions = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getPredictions();

      console.log("Predictions from MongoDB:", data);

      if (Array.isArray(data)) {
        setPredictions(data);
      } else {
        setPredictions([]);
      }
    } catch (err) {
      console.error(
        "Failed to fetch predictions:",
        err.response?.data || err.message,
      );

      setError("Unable to load risk locations.");

      setPredictions([]);
    } finally {
      setLoading(false);
    }
  };

  // ===================================================
  // INITIAL LOAD
  // ===================================================

  useEffect(() => {
    fetchPredictions();
  }, []);

  // ===================================================
  // CONVERT API DATA → MAP DATA
  // ===================================================

  const riskLocations = useMemo(() => {
    return predictions
      .map((prediction, index) => {
        const input = prediction?.input || {};

        const latitude = Number(input.latitude ?? prediction.latitude);

        const longitude = Number(input.longitude ?? prediction.longitude);

        // =============================================
        // IMPORTANT:
        // REMOVE ANY LOCATION OUTSIDE NER
        // =============================================

        if (!isInsideNER(latitude, longitude)) {
          console.warn("Ignoring prediction outside NER:", latitude, longitude);

          return null;
        }

        // =============================================
        // RISK SCORE
        // =============================================

        let score = Number(prediction.risk_score ?? 0);

        // Protect against invalid score
        if (!Number.isFinite(score)) {
          score = 0;
        }

        // If backend accidentally sends 99.5
        // instead of 0.995
        if (score > 1) {
          score = score / 100;
        }

        score = Math.max(0, Math.min(score, 1));

        const risk = normalizeRisk(prediction.risk_level);

        return {
          id:
            prediction._id ||
            prediction.id ||
            `${latitude}-${longitude}-${index}`,

          name: `NER Risk Location ${index + 1}`,

          position: [latitude, longitude],

          risk,

          score,

          created_at: prediction.created_at,

          input,
        };
      })
      .filter(Boolean);
  }, [predictions]);

  // ===================================================
  // INVALID PREDICTION COUNT
  // ===================================================

  const invalidPredictionCount = Math.max(
    predictions.length - riskLocations.length,
    0,
  );

  // ===================================================
  // SUMMARY
  // ===================================================

  const lowRisk = riskLocations.filter(
    (location) => location.risk === "LOW",
  ).length;

  const moderateRisk = riskLocations.filter(
    (location) => location.risk === "MODERATE",
  ).length;

  const highRisk = riskLocations.filter(
    (location) => location.risk === "HIGH" || location.risk === "VERY HIGH",
  ).length;

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <div className="min-h-screen bg-[#07110e] text-[#e8edf2]">
      <main className="mx-auto max-w-375 px-4 py-8 sm:px-6 lg:px-8">
        {/* =================================================
            HEADER
        ================================================= */}

        <section className="mb-6">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[2px] text-[#91b66e]">
            <MapPin size={15} />
            Maps & GIS Monitoring
          </div>

          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div>
              <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Landslide Risk Map
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#7f918a]">
                Interactive visualization of AI-predicted landslide risk
                locations across Northeast India.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* REFRESH */}

              <button
                type="button"
                onClick={fetchPredictions}
                disabled={loading}
                className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/3 px-3 py-2 text-xs text-[#899790] transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCw
                  size={14}
                  className={loading ? "animate-spin" : ""}
                />
                Refresh
              </button>

              {/* LIVE */}

              <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/3 px-3 py-2 text-xs text-[#899790]">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#b8e986]" />
                Live monitoring
              </div>
            </div>
          </div>
        </section>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* =================================================
            INVALID DATA NOTICE
        ================================================= */}

        {!loading && invalidPredictionCount > 0 && (
          <div className="mb-6 rounded-xl border border-yellow-500/20 bg-yellow-500/10 px-4 py-3 text-xs leading-5 text-yellow-300">
            <strong>{invalidPredictionCount}</strong> prediction
            {invalidPredictionCount !== 1 ? "s" : ""} from MongoDB{" "}
            {invalidPredictionCount !== 1 ? "were" : "was"} hidden because the
            coordinates are outside the Northeast India monitoring region.
          </div>
        )}

        {/* =================================================
            SUMMARY CARDS
        ================================================= */}

        <section className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            icon={<MapPin size={19} />}
            title="NER Predictions"
            value={riskLocations.length}
            description="Valid monitoring locations"
          />

          <SummaryCard
            icon={<ShieldCheck size={19} />}
            title="Low Risk"
            value={lowRisk}
            description="Normal monitoring"
            iconClass="text-[#b8e986] bg-[#b8e986]/10"
          />

          <SummaryCard
            icon={<Activity size={19} />}
            title="Moderate Risk"
            value={moderateRisk}
            description="Increased monitoring"
            iconClass="text-yellow-400 bg-yellow-400/10"
          />

          <SummaryCard
            icon={<AlertTriangle size={19} />}
            title="High Risk"
            value={highRisk}
            description="Requires attention"
            iconClass="text-red-400 bg-red-400/10"
          />
        </section>

        {/* =================================================
            MAP + SIDE PANEL
        ================================================= */}

        <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
          {/* =================================================
              MAP
          ================================================= */}

          <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-white/2.5">
            <div className="border-b border-white/[0.07] px-5 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-base font-bold">
                    Live Risk Overview
                  </h2>

                  <p className="mt-1 text-[11px] text-[#687770]">
                    Click a marker or risk zone for more information.
                  </p>
                </div>

                <div className="hidden items-center gap-2 text-[10px] text-[#687770] sm:flex">
                  <MapPin size={13} />
                  {riskLocations.length} valid predictions
                </div>
              </div>
            </div>

            <div className="h-137.5 w-full">
              <MapContainer
                center={[25.8, 93.0]}
                zoom={7}
                scrollWheelZoom={true}
                className="h-full w-full"
              >
                {/* =================================================
                    THIS WAS MISSING BEFORE
                ================================================= */}

                <MapUpdater locations={riskLocations} />

                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* =================================================
                    MARKERS
                ================================================= */}

                {riskLocations.map((location) => {
                  const config = riskConfig[location.risk];

                  return (
                    <React.Fragment key={location.id}>
                      {/* MARKER */}

                      <Marker position={location.position}>
                        <Popup>
                          <div className="min-w-52">
                            <strong className="text-base">
                              {location.name}
                            </strong>

                            <div className="mt-2 text-xs">
                              <strong>Coordinates:</strong>{" "}
                              {location.position[0].toFixed(4)},{" "}
                              {location.position[1].toFixed(4)}
                            </div>

                            <div className="mt-2 text-xs">
                              <strong>Region:</strong> Northeast India
                            </div>

                            <div className="mt-2 text-xs">
                              <strong>Risk Level:</strong> {config.label}
                            </div>

                            <div className="mt-1 text-xs">
                              <strong>Risk Score:</strong>{" "}
                              {(location.score * 100).toFixed(2)}%
                            </div>

                            {location.input?.rainfall_24h_mm !== undefined && (
                              <div className="mt-1 text-xs">
                                <strong>24h Rainfall:</strong>{" "}
                                {location.input.rainfall_24h_mm} mm
                              </div>
                            )}

                            {location.input?.slope_degree !== undefined && (
                              <div className="mt-1 text-xs">
                                <strong>Slope:</strong>{" "}
                                {location.input.slope_degree}°
                              </div>
                            )}

                            {location.created_at && (
                              <div className="mt-2 text-[10px] text-gray-500">
                                Prediction recorded
                              </div>
                            )}
                          </div>
                        </Popup>
                      </Marker>

                      {/* RISK CIRCLE */}

                      <Circle
                        center={location.position}
                        radius={
                          location.score >= 0.75
                            ? 25000
                            : location.score >= 0.5
                              ? 20000
                              : 15000
                        }
                        pathOptions={{
                          color: config.fill,

                          fillColor: config.fill,

                          fillOpacity: 0.22,

                          weight: 1.5,
                        }}
                      />
                    </React.Fragment>
                  );
                })}
              </MapContainer>
            </div>
          </div>

          {/* =================================================
              SIDE PANEL
          ================================================= */}

          <aside className="rounded-2xl border border-white/[0.07] bg-white/2.5">
            <div className="border-b border-white/[0.07] px-5 py-4">
              <h2 className="font-display text-base font-bold">
                Risk Locations
              </h2>

              <p className="mt-1 text-[11px] text-[#687770]">
                Latest valid predictions from ML model
              </p>
            </div>

            <div className="max-h-137.5 space-y-2 overflow-y-auto p-3">
              {loading ? (
                <div className="flex min-h-40 items-center justify-center">
                  <RefreshCw
                    size={22}
                    className="animate-spin text-[#b8e986]"
                  />
                </div>
              ) : riskLocations.length === 0 ? (
                <div className="flex min-h-40 items-center justify-center px-5 text-center text-xs leading-5 text-[#687770]">
                  No valid NER predictions available.
                  <br />
                  Try a location inside Northeast India.
                </div>
              ) : (
                riskLocations.map((location) => {
                  const config = riskConfig[location.risk];

                  return (
                    <div
                      key={location.id}
                      className="rounded-xl border border-white/6 bg-black/10 p-4 transition hover:border-white/12"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex gap-3">
                          <div
                            className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${config.bg} ${config.text}`}
                          >
                            <MapPin size={17} />
                          </div>

                          <div>
                            <h3 className="text-sm font-semibold">
                              {location.position[0].toFixed(4)},{" "}
                              {location.position[1].toFixed(4)}
                            </h3>

                            <p className="mt-1 text-[10px] text-[#687770]">
                              Northeast India
                            </p>
                          </div>
                        </div>

                        <span
                          className={`rounded-full border px-2 py-1 text-[9px] font-bold uppercase ${config.bg} ${config.border} ${config.text}`}
                        >
                          {config.label}
                        </span>
                      </div>

                      {/* PROBABILITY */}

                      <div className="mt-4">
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-[10px] text-[#687770]">
                            Risk probability
                          </span>

                          <span
                            className={`text-[10px] font-bold ${config.text}`}
                          >
                            {(location.score * 100).toFixed(2)}%
                          </span>
                        </div>

                        <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${location.score * 100}%`,

                              backgroundColor: config.fill,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </aside>
        </section>

        {/* =================================================
            LEGEND
        ================================================= */}

        <section className="mt-5 rounded-2xl border border-white/[0.07] bg-white/2.5 p-5">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-display text-sm font-bold">
                Landslide Risk Legend
              </h2>

              <p className="mt-1 text-[11px] text-[#687770]">
                Risk categories generated by the XGBoost model.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <LegendItem
                color="bg-[#b8e986]"
                label="LOW"
                description="< 25%"
              />

              <LegendItem
                color="bg-yellow-400"
                label="MODERATE"
                description="25 – 49%"
              />

              <LegendItem
                color="bg-orange-400"
                label="HIGH"
                description="50 – 74%"
              />

              <LegendItem
                color="bg-red-600"
                label="VERY HIGH"
                description="≥ 75%"
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

// =====================================================
// SUMMARY CARD
// =====================================================

function SummaryCard({
  icon,
  title,
  value,
  description,
  iconClass = "text-[#b8e986] bg-[#b8e986]/10",
}) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/2.5 p-5">
      <div
        className={`grid h-10 w-10 place-items-center rounded-xl ${iconClass}`}
      >
        {icon}
      </div>

      <p className="mt-4 text-[11px] text-[#71817a]">{title}</p>

      <p className="mt-1 font-display text-2xl font-bold">{value}</p>

      <p className="mt-1 text-[10px] text-[#596761]">{description}</p>
    </div>
  );
}

// =====================================================
// LEGEND ITEM
// =====================================================

function LegendItem({ color, label, description }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-white/6 bg-black/10 px-3 py-2">
      <span className={`h-2.5 w-2.5 rounded-full ${color}`} />

      <div>
        <p className="text-[10px] font-bold">{label}</p>

        <p className="text-[9px] text-[#687770]">{description}</p>
      </div>
    </div>
  );
}

export default RiskMapPage;
