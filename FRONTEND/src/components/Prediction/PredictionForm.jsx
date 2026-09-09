import { useState } from "react";
import {
  MapPin,
  Mountain,
  CloudRain,
  Trees,
  Route,
  Activity,
} from "lucide-react";

import { predictRisk } from "../../api/risk.api";

// =====================================================
// NORTHEAST INDIA LOCATIONS
// =====================================================

const NER_LOCATIONS = [
  {
    name: "Aizawl, Mizoram",
    latitude: 23.7271,
    longitude: 92.7176,
  },
  {
    name: "Imphal, Manipur",
    latitude: 24.817,
    longitude: 93.9368,
  },
  {
    name: "Shillong, Meghalaya",
    latitude: 25.5788,
    longitude: 91.8933,
  },
  {
    name: "Kohima, Nagaland",
    latitude: 25.6751,
    longitude: 94.1086,
  },
  {
    name: "Agartala, Tripura",
    latitude: 23.8315,
    longitude: 91.2868,
  },
  {
    name: "Itanagar, Arunachal Pradesh",
    latitude: 27.0844,
    longitude: 93.6053,
  },
  {
    name: "Guwahati, Assam",
    latitude: 26.1445,
    longitude: 91.7362,
  },
  {
    name: "Gangtok, Sikkim",
    latitude: 27.3389,
    longitude: 88.6065,
  },
];

// =====================================================
// INITIAL FORM
// =====================================================

const initialForm = {
  latitude: "",
  longitude: "",
  elevation_m: "",
  slope_degree: "",
  rainfall_24h_mm: "",
  rainfall_7d_mm: "",
  soil_moisture_index: "",
  ndvi: "",
  soil_type: "",
  lithology: "",
  land_cover: "",
  distance_to_road_m: "",
  distance_to_stream_m: "",
  earthquake_distance_km: "",
};

// =====================================================
// COMPONENT
// =====================================================

function PredictionForm({ onPredict, loading }) {
  const [form, setForm] = useState(initialForm);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [error, setError] = useState("");

  // ===================================================
  // HANDLE NORMAL INPUT
  // ===================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ===================================================
  // HANDLE LOCATION
  // ===================================================

  const handleLocationChange = (e) => {
    const locationName = e.target.value;

    setSelectedLocation(locationName);

    const location = NER_LOCATIONS.find(
      (item) => item.name === locationName
    );

    if (!location) {
      setForm((prev) => ({
        ...prev,
        latitude: "",
        longitude: "",
      }));

      return;
    }

    setForm((prev) => ({
      ...prev,
      latitude: location.latitude,
      longitude: location.longitude,
    }));

    setError("");
  };

  // ===================================================
  // SUBMIT
  // ===================================================

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // -----------------------------------------------
    // LOCATION REQUIRED
    // -----------------------------------------------

    if (!selectedLocation) {
      setError("Please select a monitoring location.");
      return;
    }

    const numericFields = [
      "latitude",
      "longitude",
      "elevation_m",
      "slope_degree",
      "rainfall_24h_mm",
      "rainfall_7d_mm",
      "soil_moisture_index",
      "ndvi",
      "distance_to_road_m",
      "distance_to_stream_m",
      "earthquake_distance_km",
    ];

    const formattedData = {
      ...form,
    };

    numericFields.forEach((field) => {
      formattedData[field] = Number(formattedData[field]);
    });

    // =================================================
    // VALIDATION
    // =================================================

    if (
      formattedData.latitude < 21.5 ||
      formattedData.latitude > 29.5
    ) {
      setError("Selected location must be within Northeast India.");
      return;
    }

    if (
      formattedData.longitude < 88 ||
      formattedData.longitude > 97.5
    ) {
      setError("Selected location must be within Northeast India.");
      return;
    }

    if (formattedData.elevation_m < 0) {
      setError("Elevation cannot be negative.");
      return;
    }

    if (
      formattedData.slope_degree < 0 ||
      formattedData.slope_degree > 90
    ) {
      setError("Slope must be between 0° and 90°.");
      return;
    }

    if (formattedData.rainfall_24h_mm < 0) {
      setError("24-hour rainfall cannot be negative.");
      return;
    }

    if (formattedData.rainfall_7d_mm < 0) {
      setError("7-day rainfall cannot be negative.");
      return;
    }

    if (
      formattedData.soil_moisture_index < 0 ||
      formattedData.soil_moisture_index > 1
    ) {
      setError("Soil moisture index must be between 0 and 1.");
      return;
    }

    if (
      formattedData.ndvi < -1 ||
      formattedData.ndvi > 1
    ) {
      setError("NDVI must be between -1 and 1.");
      return;
    }

    if (formattedData.distance_to_road_m < 0) {
      setError("Distance to road cannot be negative.");
      return;
    }

    if (formattedData.distance_to_stream_m < 0) {
      setError("Distance to stream cannot be negative.");
      return;
    }

    if (formattedData.earthquake_distance_km < 0) {
      setError("Earthquake distance cannot be negative.");
      return;
    }

    // =================================================
    // SEND PREDICTION
    // =================================================

    try {
      await onPredict(formattedData);

      // Reset form after successful prediction
      setForm(initialForm);
      setSelectedLocation("");
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.detail ||
          "Unable to generate prediction."
      );
    }
  };

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8"
    >
      {/* =================================================
          LOCATION
      ================================================= */}

      <FormSection
        icon={<MapPin size={19} />}
        title="Monitoring Location"
        description="Select a location within Northeast India."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <label className="block md:col-span-2">
            <span className="mb-2 block text-xs font-medium text-[#a2afa9]">
              Location
            </span>

            <select
              value={selectedLocation}
              onChange={handleLocationChange}
              required
              className="w-full rounded-xl border border-white/10 bg-[#091712] px-4 py-3 text-sm text-white outline-none transition focus:border-[#b8e986]/50 focus:ring-1 focus:ring-[#b8e986]/20"
            >
              <option value="">
                Select monitoring location
              </option>

              {NER_LOCATIONS.map((location) => (
                <option
                  key={location.name}
                  value={location.name}
                >
                  {location.name}
                </option>
              ))}
            </select>
          </label>

          {/* AUTO LATITUDE */}

          <Input
            label="Latitude"
            name="latitude"
            type="number"
            value={form.latitude}
            readOnly
            disabled
          />

          {/* AUTO LONGITUDE */}

          <Input
            label="Longitude"
            name="longitude"
            type="number"
            value={form.longitude}
            readOnly
            disabled
          />
        </div>
      </FormSection>

      {/* =================================================
          TERRAIN
      ================================================= */}

      <FormSection
        icon={<Mountain size={19} />}
        title="Terrain & Elevation"
        description="Provide terrain characteristics for the selected location."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Input
            label="Elevation"
            suffix="m"
            name="elevation_m"
            type="number"
            step="any"
            min="0"
            placeholder="e.g. 1050"
            value={form.elevation_m}
            onChange={handleChange}
            required
          />

          <Input
            label="Slope"
            suffix="°"
            name="slope_degree"
            type="number"
            step="any"
            min="0"
            max="90"
            placeholder="e.g. 48"
            value={form.slope_degree}
            onChange={handleChange}
            required
          />
        </div>
      </FormSection>

      {/* =================================================
          RAINFALL
      ================================================= */}

      <FormSection
        icon={<CloudRain size={19} />}
        title="Rainfall & Soil"
        description="Enter recent rainfall and soil moisture conditions."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Input
            label="Rainfall - Last 24 Hours"
            suffix="mm"
            name="rainfall_24h_mm"
            type="number"
            step="any"
            min="0"
            placeholder="e.g. 145"
            value={form.rainfall_24h_mm}
            onChange={handleChange}
            required
          />

          <Input
            label="Rainfall - Last 7 Days"
            suffix="mm"
            name="rainfall_7d_mm"
            type="number"
            step="any"
            min="0"
            placeholder="e.g. 420"
            value={form.rainfall_7d_mm}
            onChange={handleChange}
            required
          />

          <Input
            label="Soil Moisture Index"
            name="soil_moisture_index"
            type="number"
            step="any"
            min="0"
            max="1"
            placeholder="0 - 1"
            value={form.soil_moisture_index}
            onChange={handleChange}
            required
          />

          <Input
            label="NDVI"
            name="ndvi"
            type="number"
            step="any"
            min="-1"
            max="1"
            placeholder="e.g. 0.31"
            value={form.ndvi}
            onChange={handleChange}
            required
          />
        </div>
      </FormSection>

      {/* =================================================
          GEOLOGY
      ================================================= */}

      <FormSection
        icon={<Trees size={19} />}
        title="Geology & Land Cover"
        description="Select the environmental characteristics."
      >
        <div className="grid gap-5 md:grid-cols-3">
          <Select
            label="Soil Type"
            name="soil_type"
            value={form.soil_type}
            onChange={handleChange}
            options={[
              "Clay",
              "Clay Loam",
              "Sandy Loam",
              "Silt Loam",
              "Loam",
            ]}
          />

          <Select
            label="Lithology"
            name="lithology"
            value={form.lithology}
            onChange={handleChange}
            options={[
              "Shale",
              "Sandstone",
              "Granite",
              "Limestone",
              "Schist",
            ]}
          />

          <Select
            label="Land Cover"
            name="land_cover"
            value={form.land_cover}
            onChange={handleChange}
            options={[
              "Forest",
              "Built-up",
              "Agriculture",
              "Grassland",
              "Bare Land",
            ]}
          />
        </div>
      </FormSection>

      {/* =================================================
          DISTANCES
      ================================================= */}

      <FormSection
        icon={<Route size={19} />}
        title="Infrastructure & Seismic Factors"
        description="Enter distances from nearby infrastructure and seismic activity."
      >
        <div className="grid gap-5 md:grid-cols-3">
          <Input
            label="Distance to Road"
            suffix="m"
            name="distance_to_road_m"
            type="number"
            step="any"
            min="0"
            placeholder="e.g. 80"
            value={form.distance_to_road_m}
            onChange={handleChange}
            required
          />

          <Input
            label="Distance to Stream"
            suffix="m"
            name="distance_to_stream_m"
            type="number"
            step="any"
            min="0"
            placeholder="e.g. 100"
            value={form.distance_to_stream_m}
            onChange={handleChange}
            required
          />

          <Input
            label="Earthquake Distance"
            suffix="km"
            name="earthquake_distance_km"
            type="number"
            step="any"
            min="0"
            placeholder="e.g. 15"
            value={form.earthquake_distance_km}
            onChange={handleChange}
            required
          />
        </div>
      </FormSection>

      {/* =================================================
          BUTTON
      ================================================= */}

      <div className="border-t border-white/[0.07] pt-6">
        {error && (
          <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#b8e986] px-6 py-4 text-sm font-bold text-[#07110e] transition hover:bg-[#caf7a1] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Activity size={19} />

          {loading
            ? "Analyzing Risk..."
            : "Predict Landslide Risk"}
        </button>
      </div>
    </form>
  );
}

// =====================================================
// FORM SECTION
// =====================================================

function FormSection({
  icon,
  title,
  description,
  children,
}) {
  return (
    <section>
      <div className="mb-5 flex items-start gap-3">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#b8e986]/10 text-[#b8e986]">
          {icon}
        </div>

        <div>
          <h2 className="font-display text-base font-bold">
            {title}
          </h2>

          <p className="mt-1 text-xs text-[#71817a]">
            {description}
          </p>
        </div>
      </div>

      {children}
    </section>
  );
}

// =====================================================
// INPUT
// =====================================================

function Input({
  label,
  name,
  suffix,
  ...props
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium text-[#a2afa9]">
        {label}
      </span>

      <div className="relative">
        <input
          name={name}
          {...props}
          className="w-full rounded-xl border border-white/10 bg-[#091712] px-4 py-3 text-sm text-white outline-none transition placeholder:text-[#4e5c57] focus:border-[#b8e986]/50 focus:ring-1 focus:ring-[#b8e986]/20 disabled:cursor-not-allowed disabled:opacity-60"
        />

        {suffix && (
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#63716b]">
            {suffix}
          </span>
        )}
      </div>
    </label>
  );
}

// =====================================================
// SELECT
// =====================================================

function Select({
  label,
  name,
  options,
  value,
  onChange,
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium text-[#a2afa9]">
        {label}
      </span>

      <select
        name={name}
        value={value}
        onChange={onChange}
        required
        className="w-full rounded-xl border border-white/10 bg-[#091712] px-4 py-3 text-sm text-white outline-none transition focus:border-[#b8e986]/50 focus:ring-1 focus:ring-[#b8e986]/20"
      >
        <option value="">
          Select {label}
        </option>

        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export default PredictionForm;