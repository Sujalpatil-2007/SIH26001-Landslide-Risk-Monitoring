import { useRef, useState } from "react";
import { ArrowLeft, BrainCircuit, Info } from "lucide-react";
import { Link } from "react-router-dom";

import PredictionForm from "../components/Prediction/PredictionForm";
import PredictionResult from "../components/Prediction/PredictionResult";
import { predictRisk } from "../api/risk.api";

function PredictionPage() {
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);

  // Reference for result section
  const resultRef = useRef(null);

  const handlePredict = async (data) => {
    try {
      setLoading(true);

      console.log("Sending prediction data:", data);

      const result = await predictRisk(data);

      console.log("Prediction result:", result);

      setPrediction(result);

      // Save latest prediction for dashboard
      localStorage.setItem(
        "latestPrediction",
        JSON.stringify({
          ...result,
          latitude: data.latitude,
          longitude: data.longitude,
          timestamp: new Date().toISOString(),
        }),
      );

      // ============================================
      // SCROLL TO RESULT
      // ============================================
      setTimeout(() => {
        resultRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    } catch (error) {
      console.error("Prediction error:", error.response?.data || error.message);

      setPrediction(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07110e] text-[#e8edf2]">
      <main className="mx-auto w-[calc(100%-28px)] max-w-350 py-8 md:w-[calc(100%-40px)]">
        {/* ============================================
            HEADER
        ============================================ */}
        <div className="mb-8">
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
                Enter environmental, geographical and geological conditions to
                estimate the probability of a landslide.
              </p>
            </div>

            <div className="flex items-start gap-2 rounded-xl border border-[#b8e986]/10 bg-[#b8e986]/5 p-4 text-xs text-[#8e9d96]">
              <Info size={16} className="mt-0.5 shrink-0 text-[#b8e986]" />

              <span>
                Prediction uses the environmental features required by the
                project's ML model.
              </span>
            </div>
          </div>
        </div>

        {/* ============================================
            CONTENT
        ============================================ */}
        <div className="grid items-start gap-6 xl:grid-cols-[1.55fr_.85fr]">
          {/* ==========================================
              FORM
          ========================================== */}
          <section className="rounded-2xl border border-white/[0.07] bg-white/2.5 p-5 sm:p-7">
            <div className="mb-8 border-b border-white/[0.07] pb-6">
              <h2 className="font-display text-lg font-bold">
                Environmental Data
              </h2>

              <p className="mt-1 text-xs text-[#71817a]">
                Provide all available information for the selected location.
              </p>
            </div>

            <PredictionForm onPredict={handlePredict} loading={loading} />
          </section>

          {/* ==========================================
              RESULT
          ========================================== */}
          <div ref={resultRef} className="scroll-mt-24">
            {loading ? (
              <div className="sticky top-24 overflow-hidden rounded-2xl border border-white/[0.07] bg-white/2.5">
                <div className="flex min-h-105 flex-col items-center justify-center p-8 text-center">
                  {/* Spinner */}
                  <div className="relative grid h-20 w-20 place-items-center">
                    <div className="absolute inset-0 animate-spin rounded-full border-4 border-white/10 border-t-[#b8e986]" />

                    <BrainCircuit size={30} className="text-[#b8e986]" />
                  </div>

                  <h2 className="mt-6 font-display text-xl font-bold">
                    Analyzing Risk...
                  </h2>

                  <p className="mt-3 max-w-sm text-sm leading-6 text-[#71817a]">
                    AI model is analyzing the environmental, geographical and
                    geological conditions.
                  </p>

                  <div className="mt-6 flex items-center gap-2 text-xs text-[#91b66e]">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-[#b8e986]" />
                    Running XGBoost prediction
                  </div>
                </div>
              </div>
            ) : (
              <PredictionResult result={prediction} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default PredictionPage;
