import {
  AlertTriangle,
  CheckCircle,
  ShieldAlert,
} from "lucide-react";

function PredictionResult({ result }) {
  if (!result) {
    return (
      <div className="sticky top-24 rounded-2xl border border-white/[0.07] bg-white/2.5 p-8">
        <div className="flex min-h-105 flex-col items-center justify-center text-center">
          <div className="grid h-20 w-20 place-items-center rounded-full bg-[#b8e986]/10 text-[#b8e986]">
            <ShieldAlert size={36} />
          </div>

          <h2 className="mt-6 font-display text-xl font-bold">
            No Prediction Yet
          </h2>

          <p className="mt-3 max-w-sm text-sm leading-6 text-[#71817a]">
            Enter the environmental and geographical information, then run
            the AI model to calculate landslide risk.
          </p>
        </div>
      </div>
    );
  }

  const probability = Number(result.risk_score || 0);
  const riskLevel = String(result.risk_level || "Unknown")
  .trim()
  .toUpperCase();
const normalizedRiskLevel = riskLevel.toLowerCase();
  const recommendation =
    result.recommendation || "Continue monitoring the location.";

const isVeryHigh = riskLevel === "VERY HIGH";
const isHigh = riskLevel === "HIGH";
const isModerate = riskLevel === "MODERATE";

  const icon = isVeryHigh || isHigh
    ? <AlertTriangle size={32} />
    : <CheckCircle size={32} />;

  return (
    <div id="result" className="sticky top-24 overflow-hidden rounded-2xl border border-white/[0.07] bg-white/2.5">
      <div className="border-b border-white/[0.07] p-6">
        <p className="text-[11px] font-bold uppercase tracking-[2px] text-[#91b66e]">
          AI Prediction Result
        </p>

        <h2 className="mt-2 font-display text-xl font-bold">
          Landslide Risk Assessment
        </h2>
      </div>

      <div className="p-6">
        <div
          className={`mx-auto grid h-52 w-52 place-items-center rounded-full border-12 ${
            isVeryHigh
              ? "border-red-500/20"
              : isHigh
                ? "border-orange-500/20"
                : isModerate
                  ? "border-yellow-500/20"
                  : "border-[#b8e986]/20"
          }`}
        >
          <div className="text-center">
            <div className="font-display text-4xl font-bold">
              {(probability * 100).toFixed(2)}%
            </div>

            <p className="mt-1 text-xs text-[#71817a]">
              Landslide probability
            </p>
          </div>
        </div>

        <div className="mt-7 flex justify-center">
          <div
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${
              isVeryHigh
                ? "bg-red-500/10 text-red-400"
                : isHigh
                  ? "bg-orange-500/10 text-orange-400"
                  : isModerate
                    ? "bg-yellow-500/10 text-yellow-400"
                    : "bg-[#b8e986]/10 text-[#b8e986]"
            }`}
          >
            {icon}
            {riskLevel
  .toLowerCase()
  .replace(/\b\w/g, (char) => char.toUpperCase())} Risk
          </div>
        </div>

        <div className="mt-8 rounded-xl border border-white/[0.07] bg-black/10 p-5">
          <p className="text-[11px] font-bold uppercase tracking-[1.5px] text-[#687770]">
            Recommendation
          </p>

          <p className="mt-3 text-sm leading-6 text-[#b5c0bb]">
            {recommendation}
          </p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-black/10 p-4">
            <p className="text-[10px] text-[#687770]">Model</p>
            <p className="mt-1 text-sm font-semibold">
              XGBoost
            </p>
          </div>

          <div className="rounded-xl bg-black/10 p-4">
            <p className="text-[10px] text-[#687770]">Status</p>
            <p className="mt-1 text-sm font-semibold text-[#b8e986]">
              Analyzed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PredictionResult;