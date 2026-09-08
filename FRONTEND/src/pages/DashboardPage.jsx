import {
  Activity,
  AlertTriangle,
  CloudRain,
  MapPin,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const riskData = [
  { name: "Mon", risk: 32 },
  { name: "Tue", risk: 38 },
  { name: "Wed", risk: 45 },
  { name: "Thu", risk: 51 },
  { name: "Fri", risk: 62 },
  { name: "Sat", risk: 71 },
  { name: "Sun", risk: 68 },
];

const rainfallData = [
  { name: "Mon", rainfall: 42 },
  { name: "Tue", rainfall: 58 },
  { name: "Wed", rainfall: 74 },
  { name: "Thu", rainfall: 91 },
  { name: "Fri", rainfall: 116 },
  { name: "Sat", rainfall: 143 },
  { name: "Sun", rainfall: 128 },
];

const recentAlerts = [
  {
    location: "Aizawl",
    probability: "99.78%",
    level: "Very High",
    time: "12 min ago",
  },
  {
    location: "Kolasib",
    probability: "78.42%",
    level: "Very High",
    time: "28 min ago",
  },
  {
    location: "Champhai",
    probability: "61.35%",
    level: "High",
    time: "45 min ago",
  },
  {
    location: "Serchhip",
    probability: "42.18%",
    level: "Moderate",
    time: "1 hr ago",
  },
];

function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#07110e] px-4 py-6 text-[#e8edf2] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-350">
        {/* HEADER */}
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

          <div className="flex items-center gap-2 self-start rounded-lg border border-white/10 bg-white/3 px-3 py-2 text-xs text-[#899790] md:self-auto">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#b8e986]" />
            System operational
          </div>
        </div>

        {/* STAT CARDS */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={<MapPin size={21} />}
            title="Monitored Locations"
            value="1,248"
            change="+8.4%"
            description="from last week"
          />

          <StatCard
            icon={<AlertTriangle size={21} />}
            title="High Risk Locations"
            value="86"
            change="+12"
            description="currently detected"
            warning
          />

          <StatCard
            icon={<CloudRain size={21} />}
            title="Avg. Rainfall"
            value="128 mm"
            change="+18.6%"
            description="last 24 hours"
          />

          <StatCard
            icon={<ShieldCheck size={21} />}
            title="Active Alerts"
            value="24"
            change="-5"
            description="from yesterday"
          />
        </div>

        {/* MAIN CHARTS */}
        <div className="mt-6 grid gap-6 xl:grid-cols-[1.7fr_1fr]">
          {/* RISK TREND */}
          <section className="rounded-2xl border border-white/[0.07] bg-white/2.5 p-5 sm:p-6">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="font-display text-lg font-bold">Risk Trend</h2>

                <p className="mt-1 text-xs text-[#71817a]">
                  Average predicted landslide probability
                </p>
              </div>

              <div className="rounded-lg bg-[#b8e986]/10 px-3 py-1.5 text-xs font-semibold text-[#b8e986]">
                Last 7 days
              </div>
            </div>

            <div className="h-70 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={riskData}>
                  <defs>
                    <linearGradient
                      id="riskGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopOpacity={0.25} />
                      <stop offset="100%" stopOpacity={0} />
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
                    tick={{ fill: "#71817a", fontSize: 11 }}
                  />

                  <YAxis
                    domain={[0, 100]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#71817a", fontSize: 11 }}
                  />

                  <Tooltip
                    contentStyle={{
                      background: "#0e1d18",
                      border: "1px solid rgba(255,255,255,.1)",
                      borderRadius: "10px",
                      color: "#fff",
                    }}
                    formatter={(value) => [`${value}%`, "Risk"]}
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

          {/* CURRENT STATUS */}
          <section className="rounded-2xl border border-white/[0.07] bg-white/2.5 p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-lg font-bold">Current Risk</h2>

                <p className="mt-1 text-xs text-[#71817a]">
                  Overall monitored region
                </p>
              </div>

              <TrendingUp size={20} className="text-[#b8e986]" />
            </div>

            <div className="mt-8 flex flex-col items-center">
              <div className="relative grid h-48 w-48 place-items-center rounded-full border-12 border-[#b8e986]/20">
                <div className="absolute inset-0 rounded-full border-12 border-transparent border-t-[#b8e986] border-r-[#b8e986] rotate-[-25deg]" />

                <div className="text-center">
                  <div className="font-display text-4xl font-bold">68.4%</div>

                  <div className="mt-1 text-xs text-[#81908a]">
                    Risk probability
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-full border border-[#f59e0b]/20 bg-[#f59e0b]/10 px-4 py-2 text-sm font-semibold text-[#fbbf55]">
                High Risk
              </div>

              <p className="mt-4 max-w-xs text-center text-xs leading-5 text-[#71817a]">
                Current environmental conditions indicate increased landslide
                potential.
              </p>
            </div>
          </section>
        </div>

        {/* RAINFALL */}
        <section className="mt-6 rounded-2xl border border-white/[0.07] bg-white/2.5 p-5 sm:p-6">
          <div className="mb-6">
            <h2 className="font-display text-lg font-bold">
              Rainfall Monitoring
            </h2>

            <p className="mt-1 text-xs text-[#71817a]">
              Average rainfall recorded over the last 7 days
            </p>
          </div>

          <div className="h-65 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={rainfallData}>
                <defs>
                  <linearGradient
                    id="rainfallGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopOpacity={0.2} />
                    <stop offset="100%" stopOpacity={0} />
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
                  tick={{ fill: "#71817a", fontSize: 11 }}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#71817a", fontSize: 11 }}
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

        {/* ALERTS */}
        <section className="mt-6 rounded-2xl border border-white/[0.07] bg-white/2.5 p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-bold">Recent Alerts</h2>

              <p className="mt-1 text-xs text-[#71817a]">
                Latest AI-generated risk notifications
              </p>
            </div>

            <button className="text-xs font-semibold text-[#b8e986] hover:underline">
              View all
            </button>
          </div>

          <div className="space-y-2">
            {recentAlerts.map((alert) => (
              <AlertRow key={alert.location} alert={alert} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
  change,
  description,
  warning = false,
}) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[2.5 p-5 transition hover:border-white/[0.14]">
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

function AlertRow({ alert }) {
  const isVeryHigh = alert.level === "Very High";
  const isHigh = alert.level === "High";

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-white/6 bg-black/10 p-4 transition hover:bg-white/3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div
          className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${
            isVeryHigh
              ? "bg-red-500/10 text-red-400"
              : isHigh
                ? "bg-orange-500/10 text-orange-400"
                : "bg-yellow-500/10 text-yellow-400"
          }`}
        >
          <AlertTriangle size={18} />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">{alert.location}</span>

            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                isVeryHigh
                  ? "bg-red-500/10 text-red-400"
                  : isHigh
                    ? "bg-orange-500/10 text-orange-400"
                    : "bg-yellow-500/10 text-yellow-400"
              }`}
            >
              {alert.level}
            </span>
          </div>

          <p className="mt-1 text-[11px] text-[#64726d]">{alert.time}</p>
        </div>
      </div>

      <div className="flex items-center gap-6 pl-13 sm:pl-0">
        <div>
          <p className="text-[10px] text-[#64726d]">Probability</p>
          <p className="mt-1 text-sm font-bold">{alert.probability}</p>
        </div>

        <div className="h-8 w-px bg-white/10" />

        <span className="text-xs font-medium text-[#b8e986]">Active</span>
      </div>
    </div>
  );
}

export default DashboardPage;
