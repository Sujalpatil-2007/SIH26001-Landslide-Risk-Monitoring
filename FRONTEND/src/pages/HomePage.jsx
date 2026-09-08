import { Link } from "react-router-dom";
import {
  ArrowRight,
  BrainCircuit,
  CloudRain,
  Map,
  ShieldAlert,
  Activity,
  Mountain,
  Satellite,
} from "lucide-react";

import Navbar from "../components/common/Navbar";

function HomePage() {
  return (
    <div className="min-h-screen bg-[#07110e] text-[#e8edf2]">
      <Navbar />

      {/* HERO */}
      <section className="mx-auto grid min-h-170 w-[calc(100%-28px)] max-w-300 items-center gap-12 md:w-[calc(100%-40px)] lg:grid-cols-[1.05fr_.95fr]">
        <div className="py-16">
          <div className="flex w-fit items-center gap-2 rounded-full border border-[#b8e986]/20 bg-[#b8e986]/5 px-3 py-2 text-xs font-semibold text-[#b8e986]">
            <Activity size={15} />
            AI-Powered Early Warning System
          </div>

          <h1 className="mt-6 max-w-3xl font-display text-5xl font-bold leading-[.98] tracking-[-2px] sm:text-6xl lg:text-[76px]">
            Predict Landslide Risk{" "}
            <span className="text-[#b8e986]">Before It Happens.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-[#9eada7] sm:text-lg">
            An intelligent landslide risk monitoring and early-warning
            platform designed for the North Eastern Region of India.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/prediction"
              className="flex items-center justify-center gap-2 rounded-xl bg-[#b8e986] px-5 py-3 text-sm font-bold text-[#07110e] transition hover:-translate-y-0.5 hover:bg-[#caf7a1]"
            >
              Check Risk
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/risk-map"
              className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/3 px-5 py-3 text-sm font-semibold text-[#d7dfdb] transition hover:bg-white/[.07]"
            >
              <Map size={18} />
              Explore Risk Map
            </Link>
          </div>

          <div className="mt-14 flex gap-7 sm:gap-11">
            <Stat value="15+" label="Risk Features" />
            <Stat value="AI" label="Powered Prediction" />
            <Stat value="24/7" label="Risk Monitoring" />
          </div>
        </div>

        {/* HERO VISUAL */}
        <div className="relative grid min-h-100 place-items-center">
          <div className="flex h-67.5 w-67.5 flex-col items-center justify-center gap-4 rounded-full border border-[#b8e986]/20 bg-[radial-gradient(circle,rgba(184,233,134,.12),transparent_60%)] text-[#b8e986] shadow-[0_0_100px_rgba(184,233,134,.08)] sm:h-82.5 sm:w-82.5">
            <Mountain size={100} strokeWidth={1.2} />

            <div className="text-center">
              <span className="block text-[11px] tracking-[2px] text-[#71817a]">
                LIVE RISK
              </span>

              <strong className="font-display text-lg tracking-wider">
                MONITORING
              </strong>
            </div>
          </div>

          <FloatingCard
            icon={<CloudRain size={20} />}
            title="Rainfall"
            subtitle="Real-time monitoring"
            position="left-0 top-[18%]"
          />

          <FloatingCard
            icon={<BrainCircuit size={20} />}
            title="AI Prediction"
            subtitle="Risk analysis"
            position="bottom-[15%] right-0"
          />
        </div>
      </section>

      {/* WORKFLOW */}
      <section className="mx-auto w-[calc(100%-28px)] max-w-300 py-24 md:w-[calc(100%-40px)]">
        <SectionHeading
          label="HOW IT WORKS"
          title={
            <>
              From environmental data
              <br className="hidden sm:block" /> to early warning.
            </>
          }
          description="Multiple environmental and geographical factors are analyzed by our machine-learning pipeline to estimate landslide probability."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <WorkflowCard
            icon={<Satellite />}
            number="01"
            title="Collect Data"
            description="Analyze terrain, rainfall, soil, vegetation, geological and seismic factors."
          />

          <WorkflowCard
            icon={<BrainCircuit />}
            number="02"
            title="AI Analysis"
            description="Machine learning evaluates the combination of risk factors."
          />

          <WorkflowCard
            icon={<Activity />}
            number="03"
            title="Predict Risk"
            description="Generate a landslide probability and classify the risk level."
          />

          <WorkflowCard
            icon={<ShieldAlert />}
            number="04"
            title="Early Warning"
            description="Provide actionable recommendations for monitoring and response."
          />
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto w-[calc(100%-28px)] max-w-300 py-24 md:w-[calc(100%-40px)]">
        <SectionHeading
          label="SYSTEM CAPABILITIES"
          title="One platform. Complete risk visibility."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            icon={<Map />}
            title="Interactive Risk Map"
            description="Visualize landslide-prone locations and risk levels across monitored regions."
          />

          <FeatureCard
            icon={<BrainCircuit />}
            title="AI Risk Prediction"
            description="Estimate landslide probability using environmental and geographical features."
          />

          <FeatureCard
            icon={<ShieldAlert />}
            title="Early Warnings"
            description="Identify high-risk locations and generate actionable warning recommendations."
          />

          <FeatureCard
            icon={<Activity />}
            title="Risk Analytics"
            description="Monitor trends, predictions, alerts and regional risk statistics."
          />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mx-auto flex w-[calc(100%-28px)] max-w-300 flex-col gap-5 border-t border-white/10 py-9 text-xs text-[#64726d] md:w-[calc(100%-40px)] md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-1">
          <strong className="text-[#aab7b1]">LandslideGuard</strong>
          <span>
            AI-Based Early Warning & Landslide Risk Monitoring System
          </span>
        </div>

        <span>SIH26001 • North Eastern Region of India</span>
      </footer>
    </div>
  );
}

function Stat({ value, label }) {
  return (
    <div className="flex flex-col gap-1">
      <strong className="font-display text-2xl">{value}</strong>
      <span className="text-xs text-[#72827b]">{label}</span>
    </div>
  );
}

function FloatingCard({ icon, title, subtitle, position }) {
  return (
    <div
      className={`absolute ${position} flex items-center gap-3 rounded-xl border border-white/10 bg-[#0e1d18]/90 px-4 py-3 shadow-2xl backdrop-blur-xl`}
    >
      <div className="text-[#b8e986]">{icon}</div>

      <div className="flex flex-col gap-0.5">
        <strong className="text-xs">{title}</strong>
        <span className="text-[10px] text-[#75847e]">{subtitle}</span>
      </div>
    </div>
  );
}

function SectionHeading({ label, title, description }) {
  return (
    <div className="mb-12 max-w-2xl">
      <div className="text-[11px] font-bold tracking-[2px] text-[#91b66e]">
        {label}
      </div>

      <h2 className="mt-3 font-display text-3xl font-bold leading-tight tracking-[-1px] sm:text-5xl">
        {title}
      </h2>

      {description && (
        <p className="mt-4 leading-7 text-[#85938d]">{description}</p>
      )}
    </div>
  );
}

function WorkflowCard({ icon, number, title, description }) {
  return (
    <div className="rounded-2xl border border-white/[.07] bg-white/2.5 p-6 transition duration-300 hover:-translate-y-1 hover:border-[#b8e986]/20 hover:bg-[#b8e986]/[.035]">
      <div className="flex items-center justify-between">
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#b8e986]/10 text-[#b8e986]">
          {icon}
        </div>

        <span className="font-display text-2xl text-[#43524c]">
          {number}
        </span>
      </div>

      <h3 className="mt-6 font-display text-lg font-bold">{title}</h3>

      <p className="mt-2 text-sm leading-7 text-[#788780]">{description}</p>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="group rounded-2xl border border-white/[.07] bg-white/2.5 p-6 transition duration-300 hover:-translate-y-1 hover:border-[#b8e986]/20 hover:bg-[#b8e986]/[.035]">
      <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#b8e986]/10 text-[#b8e986]">
        {icon}
      </div>

      <h3 className="mt-6 font-display text-lg font-bold">{title}</h3>

      <p className="mt-2 text-sm leading-7 text-[#788780]">{description}</p>

      <ArrowRight
        size={18}
        className="mt-6 text-[#65736e] transition group-hover:translate-x-1 group-hover:text-[#b8e986]"
      />
    </div>
  );
}

export default HomePage;