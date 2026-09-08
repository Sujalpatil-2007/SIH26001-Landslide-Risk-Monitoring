import {
  BrainCircuit,
  CloudRain,
  Database,
  Map,
  Mountain,
  ShieldCheck,
  Target,
  Waves,
} from "lucide-react";

const features = [
  {
    icon: <BrainCircuit size={22} />,
    title: "AI Risk Prediction",
    description:
      "Machine learning analyzes geographical, geological and environmental factors to estimate landslide probability.",
  },
  {
    icon: <CloudRain size={22} />,
    title: "Rainfall Monitoring",
    description:
      "Recent 24-hour and 7-day rainfall conditions are considered important indicators of changing landslide risk.",
  },
  {
    icon: <Mountain size={22} />,
    title: "Terrain Analysis",
    description:
      "Elevation and slope characteristics help identify areas that may be more vulnerable to slope failure.",
  },
  {
    icon: <Map size={22} />,
    title: "Risk Visualization",
    description:
      "Interactive geographical visualization helps users understand the spatial distribution of landslide risk.",
  },
  {
    icon: <ShieldCheck size={22} />,
    title: "Early Warning",
    description:
      "High-risk predictions can support precautionary monitoring and early-warning decisions.",
  },
  {
    icon: <Database size={22} />,
    title: "Data-Driven System",
    description:
      "Multiple environmental and geographical features are combined to generate a more comprehensive assessment.",
  },
];

const workflow = [
  {
    number: "01",
    title: "Collect Data",
    description:
      "Gather geographical, terrain, rainfall, soil, land-cover and seismic information.",
  },
  {
    number: "02",
    title: "Analyze Conditions",
    description:
      "Process the environmental features required by the machine learning model.",
  },
  {
    number: "03",
    title: "Predict Risk",
    description:
      "The trained ML model estimates the probability of landslide occurrence.",
  },
  {
    number: "04",
    title: "Generate Warning",
    description:
      "Convert the prediction into a practical risk level and monitoring recommendation.",
  },
];

function AboutPage() {
  return (
    <div className="min-h-screen bg-[#07110e] text-[#e8edf2]">
      <main className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-8">
        {/* HERO */}
        <section className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.025] px-6 py-14 sm:px-10 lg:px-16 lg:py-20">
          <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-[#b8e986]/5 blur-3xl" />

          <div className="relative max-w-4xl">
            <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[2px] text-[#91b66e]">
              <ShieldCheck size={16} />
              SIH26001
            </div>

            <h1 className="font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              AI-Based Early Warning &{" "}
              <span className="text-[#b8e986]">Landslide Risk Monitoring</span>{" "}
              System
            </h1>

            <p className="mt-6 max-w-3xl text-sm leading-7 text-[#81908a] sm:text-base">
              A data-driven monitoring platform designed to assess landslide
              risk using environmental, geographical and geological factors,
              with a focus on the North Eastern Region of India.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <span className="rounded-full border border-[#b8e986]/20 bg-[#b8e986]/5 px-4 py-2 text-xs font-medium text-[#b8e986]">
                AI / Machine Learning
              </span>

              <span className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-medium text-[#a0aca7]">
                Early Warning
              </span>

              <span className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-medium text-[#a0aca7]">
                Risk Monitoring
              </span>
            </div>
          </div>
        </section>

        {/* PROBLEM */}
        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <InfoSection
            icon={<Target size={21} />}
            eyebrow="The Problem"
            title="Why landslide risk monitoring matters"
          >
            <p>
              Landslides can be influenced by rainfall, terrain conditions, soil
              properties, land cover, geological characteristics and other
              environmental factors.
            </p>

            <p>
              Identifying combinations of these factors early can help
              authorities and communities focus monitoring efforts on locations
              with elevated risk.
            </p>
          </InfoSection>

          <InfoSection
            icon={<Waves size={21} />}
            eyebrow="Our Approach"
            title="From environmental data to actionable risk"
          >
            <p>
              The system combines multiple environmental and geographical inputs
              and sends them through a trained machine learning model to
              estimate landslide probability.
            </p>

            <p>
              The prediction is then presented as an understandable risk
              category with a recommended monitoring response.
            </p>
          </InfoSection>
        </section>

        {/* FEATURES */}
        <section className="mt-16">
          <SectionHeading
            eyebrow="Platform Capabilities"
            title="Built for proactive monitoring"
            description="The platform brings prediction, monitoring and early-warning capabilities into one interface."
          />

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6 transition hover:-translate-y-1 hover:border-[#b8e986]/20"
              >
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#b8e986]/10 text-[#b8e986]">
                  {feature.icon}
                </div>

                <h3 className="mt-5 font-display text-base font-bold">
                  {feature.title}
                </h3>

                <p className="mt-2 text-xs leading-6 text-[#71817a]">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* INPUT FEATURES */}
        <section className="mt-16 rounded-3xl border border-white/[0.07] bg-white/[0.025] p-6 sm:p-8 lg:p-10">
          <SectionHeading
            eyebrow="ML Input Features"
            title="What the model analyzes"
            description="The prediction system uses the following geographical and environmental features."
          />

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[
              "Latitude",
              "Longitude",
              "Elevation",
              "Slope Degree",
              "24h Rainfall",
              "7-Day Rainfall",
              "Soil Moisture Index",
              "NDVI",
              "Soil Type",
              "Lithology",
              "Land Cover",
              "Distance to Road",
              "Distance to Stream",
              "Earthquake Distance",
            ].map((item, index) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-black/10 px-4 py-3"
              >
                <span className="text-[10px] font-bold text-[#91b66e]">
                  {(index + 1).toString().padStart(2, "0")}
                </span>

                <span className="text-xs font-medium text-[#a5b0ab]">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* WORKFLOW */}
        <section className="mt-16">
          <SectionHeading
            eyebrow="System Workflow"
            title="How the system works"
            description="A simple pipeline converts raw environmental information into an understandable risk assessment."
          />

          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {workflow.map((step) => (
              <div
                key={step.number}
                className="relative rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6"
              >
                <span className="font-display text-3xl font-bold text-[#b8e986]/20">
                  {step.number}
                </span>

                <h3 className="mt-4 font-display text-base font-bold">
                  {step.title}
                </h3>

                <p className="mt-2 text-xs leading-6 text-[#71817a]">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* RISK LEVELS */}
        <section className="mt-16">
          <SectionHeading
            eyebrow="Risk Classification"
            title="From probability to action"
            description="The predicted probability is translated into an easy-to-understand risk category."
          />

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <RiskLevel
              level="Low"
              range="< 25%"
              description="Normal monitoring."
            />

            <RiskLevel
              level="Moderate"
              range="25 – 49%"
              description="Increase monitoring of the location."
            />

            <RiskLevel
              level="High"
              range="50 – 74%"
              description="Issue precautionary warning and monitor closely."
            />

            <RiskLevel
              level="Very High"
              range="≥ 75%"
              description="Issue early warning and prioritize immediate monitoring."
            />
          </div>
        </section>

        {/* FOOTER MESSAGE */}
        <section className="mt-16 rounded-3xl border border-[#b8e986]/10 bg-[#b8e986]/5 p-8 text-center sm:p-12">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#b8e986]/10 text-[#b8e986]">
            <ShieldCheck size={26} />
          </div>

          <h2 className="mt-5 font-display text-2xl font-bold">
            Predict earlier. Monitor smarter.
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#81908a]">
            The goal is to transform environmental data into timely,
            understandable information that can support landslide risk
            monitoring and early-warning efforts.
          </p>
        </section>
      </main>
    </div>
  );
}

function InfoSection({ icon, eyebrow, title, children }) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#b8e986]/10 text-[#b8e986]">
          {icon}
        </div>

        <span className="text-[10px] font-bold uppercase tracking-[1.5px] text-[#91b66e]">
          {eyebrow}
        </span>
      </div>

      <h2 className="mt-5 font-display text-xl font-bold">{title}</h2>

      <div className="mt-4 space-y-3 text-sm leading-7 text-[#71817a]">
        {children}
      </div>
    </div>
  );
}

function SectionHeading({ eyebrow, title, description }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[2px] text-[#91b66e]">
        {eyebrow}
      </p>

      <h2 className="mt-2 font-display text-2xl font-bold sm:text-3xl">
        {title}
      </h2>

      <p className="mt-2 max-w-2xl text-sm leading-6 text-[#71817a]">
        {description}
      </p>
    </div>
  );
}

function RiskLevel({ level, range, description }) {
  const classes = {
    Low: "border-[#b8e986]/10 bg-[#b8e986]/5 text-[#b8e986]",
    Moderate: "border-yellow-500/10 bg-yellow-500/5 text-yellow-400",
    High: "border-orange-500/10 bg-orange-500/5 text-orange-400",
    "Very High": "border-red-500/10 bg-red-500/5 text-red-400",
  };

  return (
    <div className={`rounded-2xl border p-5 ${classes[level]}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold">{level}</span>

        <span className="text-xs font-semibold">{range}</span>
      </div>

      <p className="mt-4 text-xs leading-5 opacity-70">{description}</p>
    </div>
  );
}

export default AboutPage;
