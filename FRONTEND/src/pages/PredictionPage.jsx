import { useState } from "react";
import {
  ArrowLeft,
  BrainCircuit,
  Info,
} from "lucide-react";
import { Link } from "react-router-dom";

import PredictionForm from "../components/Prediction/PredictionForm";
import PredictionResult from "../components/Prediction/PredictionResult";

function PredictionPage() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async (inputData) => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("http://localhost:8000/api/risk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputData),
      });

      if (!response.ok) {
        throw new Error("Prediction request failed");
      }

      const data = await response.json();

      const predictionResult = {
        probability: data.risk_score * 100,
        risk_level: data.risk_level,
        recommendation:
          data.risk_level === "VERY HIGH"
            ? "Issue early warning and prioritize immediate monitoring."
            : data.risk_level === "HIGH"
            ? "Increase monitoring and prepare an early warning."
            : data.risk_level === "MODERATE"
            ? "Continue monitoring the location."
            : "Risk is currently low. Continue routine monitoring.",
      };

      setResult(predictionResult);
    } catch (error) {
      console.error("Prediction error:", error);
      alert("Unable to connect to the prediction server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07110e] text-[#e8edf2]">
      <main className="mx-auto w-[calc(100%-28px)] max-w-350 py-8 md:w-[calc(100%-40px)]">

        {/* HEADER */}
        <div className="mb-8">
          <Link
            to="/dashboard"
            className="mb-5 inline-flex items-center gap-2 text-xs font-medium text-[#71817a] transition hover:text-[#b8e986]"
          >
            <ArrowLeft size={15} />
            Back to Dashboard
          </Link>

          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[2px] text-[#91b66e]">
                <BrainCircuit size={15} />
                AI Risk Prediction
              </div>

              <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Predict Landslide Risk
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#7f918a]">
                Enter environmental, geographical and geological conditions
                to estimate the probability of a landslide.
              </p>
            </div>

            <div className="flex items-start gap-2 rounded-xl border border-[#b8e986]/10 bg-[#b8e986]/5 p-4 text-xs text-[#8e9d96]">
              <Info
                size={16}
                className="mt-0.5 shrink-0 text-[#b8e986]"
              />

              <span>
                Prediction uses the environmental features required by
                the project's ML model.
              </span>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="grid items-start gap-6 xl:grid-cols-[1.55fr_.85fr]">

          {/* FORM */}
          <section className="rounded-2xl border border-white/[0.07] bg-white/2.5 p-5 sm:p-7">
            <div className="mb-8 border-b border-white/[0.07] pb-6">
              <h2 className="font-display text-lg font-bold">
                Environmental Data
              </h2>

              <p className="mt-1 text-xs text-[#71817a]">
                Provide all available information for the selected location.
              </p>
            </div>

            <PredictionForm
              onPredict={handlePredict}
              loading={loading}
            />
          </section>

          {/* RESULT */}
          <PredictionResult result={result} />
        </div>
      </main>
    </div>
  );
}

export default PredictionPage;
