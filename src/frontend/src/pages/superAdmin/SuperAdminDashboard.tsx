import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  Building2,
  CheckCircle,
  DollarSign,
  Plus,
  TrendingUp,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  collegeGrowthData,
  colleges,
  revenueByPlan,
} from "../../data/seedData";

const CARD = "bg-card rounded-2xl border border-border shadow-card p-5";
const INPUT =
  "w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all";

function StatCard({
  icon: Icon,
  value,
  label,
  sub,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  label: string;
  sub?: string;
  color: string;
}) {
  return (
    <motion.div
      className={`${CARD} flex items-start gap-4`}
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-xs font-medium text-foreground mt-0.5">{label}</p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </div>
    </motion.div>
  );
}

const planColors: Record<string, string> = {
  Basic: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  Pro: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  Enterprise:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
};

export function SuperAdminDashboard({ section }: { section: string }) {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: "",
    subdomain: "",
    email: "",
    plan: "Pro",
  });
  const [collegesList, setCollegesList] = useState(colleges);

  const totalStudents = colleges.reduce((s, c) => s + c.studentCount, 0);
  const totalRevenue = colleges.reduce((s, c) => s + c.monthlyRevenue, 0);
  const activeColleges = colleges.filter((c) => c.status === "active").length;

  const handleAdd = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const toggleStatus = (id: string) => {
    setCollegesList((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status:
                c.status === "active"
                  ? ("suspended" as const)
                  : ("active" as const),
            }
          : c,
      ),
    );
  };

  if (section === "colleges") {
    return (
      <div className="p-6 space-y-6">
        <h2 className="text-xl font-bold text-foreground">
          Colleges Management
        </h2>
        <div className={CARD}>
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Plus className="w-4 h-4 text-primary" /> Add New College
          </h3>
          <div className="flex items-center gap-2 mb-5 px-3 py-2 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-xl">
            <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0" />
            <span className="text-sm text-yellow-700 dark:text-yellow-400">
              Demo Mode — college creation is simulated
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="block text-xs font-medium text-muted-foreground mb-1.5">
                College Name
              </span>
              <input
                className={INPUT}
                placeholder="e.g. AITS, GECB"
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                data-ocid="super.college.input"
              />
            </div>
            <div>
              <span className="block text-xs font-medium text-muted-foreground mb-1.5">
                Subdomain
              </span>
              <div className="flex">
                <input
                  className={`${INPUT} rounded-r-none`}
                  placeholder="aits"
                  value={form.subdomain}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, subdomain: e.target.value }))
                  }
                />
                <span className="px-3 py-2.5 bg-muted border border-l-0 border-border rounded-r-xl text-sm text-muted-foreground whitespace-nowrap">
                  .erp.edunest.com
                </span>
              </div>
            </div>
            <div>
              <span className="block text-xs font-medium text-muted-foreground mb-1.5">
                Contact Email
              </span>
              <input
                className={INPUT}
                type="email"
                placeholder="admin@college.edu"
                value={form.email}
                onChange={(e) =>
                  setForm((p) => ({ ...p, email: e.target.value }))
                }
              />
            </div>
            <div>
              <span className="block text-xs font-medium text-muted-foreground mb-1.5">
                Plan
              </span>
              <select
                className={INPUT}
                value={form.plan}
                onChange={(e) =>
                  setForm((p) => ({ ...p, plan: e.target.value }))
                }
                data-ocid="super.college.select"
              >
                {["Basic", "Pro", "Enterprise"].map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            className="mt-4 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors"
            data-ocid="super.college.submit_button"
          >
            {saved ? (
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> College Added! (Demo)
              </span>
            ) : (
              "Add College"
            )}
          </button>
        </div>

        <div className={CARD}>
          <h3 className="font-semibold text-foreground mb-4">All Colleges</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {[
                    "College",
                    "Location",
                    "Students",
                    "Plan",
                    "Revenue/mo",
                    "Status",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left py-2 pr-4 text-muted-foreground font-medium whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {collegesList.map((c, i) => (
                  <tr
                    key={c.id}
                    className="border-b border-border last:border-0 hover:bg-muted/30"
                    data-ocid={`super.colleges.row.${i + 1}`}
                  >
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                          style={{ background: c.themeColor }}
                        >
                          {c.shortName.slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {c.shortName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {c.subdomain}.erp.edunest.com
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-muted-foreground">
                      {c.location}
                    </td>
                    <td className="py-3 pr-4 font-medium text-foreground">
                      {c.studentCount.toLocaleString()}
                    </td>
                    <td className="py-3 pr-4">
                      <Badge
                        className={`border-0 text-xs ${planColors[c.plan]}`}
                      >
                        {c.plan}
                      </Badge>
                    </td>
                    <td className="py-3 pr-4 font-medium text-foreground">
                      {c.monthlyRevenue > 0
                        ? `₹${c.monthlyRevenue.toLocaleString()}`
                        : "—"}
                    </td>
                    <td className="py-3 pr-4">
                      <Badge
                        className={`border-0 text-xs ${
                          c.status === "active"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {c.status}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <button
                        type="button"
                        onClick={() => toggleStatus(c.id)}
                        className="text-xs px-2.5 py-1.5 bg-muted hover:bg-muted/80 rounded-lg text-muted-foreground transition-colors"
                        data-ocid={`super.colleges.toggle.${i + 1}`}
                      >
                        {c.status === "active" ? "Suspend" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  if (section === "analytics") {
    return (
      <div className="p-6 space-y-6">
        <h2 className="text-xl font-bold text-foreground">Global Analytics</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className={CARD}>
            <h3 className="font-semibold text-foreground mb-4">
              College Growth
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart
                data={collegeGrowthData}
                margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="oklch(var(--border))"
                />
                <XAxis
                  dataKey="month"
                  tick={{
                    fontSize: 11,
                    fill: "oklch(var(--muted-foreground))",
                  }}
                />
                <YAxis
                  tick={{
                    fontSize: 11,
                    fill: "oklch(var(--muted-foreground))",
                  }}
                />
                <Tooltip
                  contentStyle={{
                    background: "oklch(var(--card))",
                    border: "1px solid oklch(var(--border))",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="colleges"
                  stroke="#2F80ED"
                  strokeWidth={2.5}
                  dot={{ fill: "#2F80ED", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className={CARD}>
            <h3 className="font-semibold text-foreground mb-4">
              Revenue by Plan
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={revenueByPlan}
                margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="oklch(var(--border))"
                />
                <XAxis
                  dataKey="plan"
                  tick={{
                    fontSize: 12,
                    fill: "oklch(var(--muted-foreground))",
                  }}
                />
                <YAxis
                  tick={{
                    fontSize: 12,
                    fill: "oklch(var(--muted-foreground))",
                  }}
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`}
                />
                <Tooltip
                  formatter={(v: number) => [
                    `₹${v.toLocaleString()}`,
                    "Monthly Revenue",
                  ]}
                  contentStyle={{
                    background: "oklch(var(--card))",
                    border: "1px solid oklch(var(--border))",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="revenue" fill="#2F80ED" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  }

  if (section === "subscriptions") {
    return (
      <div className="p-6 space-y-4">
        <h2 className="text-xl font-bold text-foreground">Subscriptions</h2>
        {collegesList.map((c, i) => (
          <div
            key={c.id}
            className={CARD}
            data-ocid={`super.subscriptions.item.${i + 1}`}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                  style={{ background: c.themeColor }}
                >
                  {c.shortName.slice(0, 2)}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{c.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {c.location} • est. {c.established}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge className={`border-0 ${planColors[c.plan]}`}>
                  {c.plan}
                </Badge>
                <select
                  className="text-xs px-2 py-1.5 bg-background border border-border rounded-lg"
                  defaultValue={c.plan}
                >
                  {["Basic", "Pro", "Enterprise"].map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
                <Badge
                  className={`border-0 text-xs ${
                    c.status === "active"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {c.status}
                </Badge>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-border">
              <div>
                <p className="text-xs text-muted-foreground">Students</p>
                <p className="font-semibold text-foreground">
                  {c.studentCount.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Monthly Revenue</p>
                <p className="font-semibold text-foreground">
                  {c.monthlyRevenue > 0
                    ? `₹${c.monthlyRevenue.toLocaleString()}`
                    : "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Website</p>
                <p className="font-semibold text-foreground text-xs">
                  {c.website}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Dashboard
  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-xl font-bold text-foreground">Platform Overview</h2>
        <p className="text-muted-foreground text-sm mt-1">
          EduNest ERP — SaaS Control Panel
        </p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Building2}
          value={String(colleges.length)}
          label="Total Colleges"
          sub={`${activeColleges} active`}
          color="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
        />
        <StatCard
          icon={Users}
          value={totalStudents.toLocaleString()}
          label="Total Students"
          color="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
        />
        <StatCard
          icon={DollarSign}
          value={`₹${(totalRevenue / 1000).toFixed(0)}K`}
          label="Monthly Revenue"
          sub="All colleges"
          color="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
        />
        <StatCard
          icon={TrendingUp}
          value={String(activeColleges)}
          label="Active Subscriptions"
          color="bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={CARD}>
          <h3 className="font-semibold text-foreground mb-4">College Growth</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart
              data={collegeGrowthData}
              margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(var(--border))"
              />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: "oklch(var(--muted-foreground))" }}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "oklch(var(--muted-foreground))" }}
              />
              <Tooltip
                contentStyle={{
                  background: "oklch(var(--card))",
                  border: "1px solid oklch(var(--border))",
                  borderRadius: "12px",
                  fontSize: "12px",
                }}
              />
              <Line
                type="monotone"
                dataKey="colleges"
                stroke="#2F80ED"
                strokeWidth={2.5}
                dot={{ fill: "#2F80ED", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className={CARD}>
          <h3 className="font-semibold text-foreground mb-4">
            Colleges Overview
          </h3>
          <div className="space-y-3">
            {collegesList.map((c, i) => (
              <div
                key={c.id}
                className="flex items-center justify-between py-2 border-b border-border last:border-0"
                data-ocid={`super.dashboard.colleges.item.${i + 1}`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ background: c.themeColor }}
                  >
                    {c.shortName.slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {c.shortName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {c.studentCount} students
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={`border-0 text-xs ${planColors[c.plan]}`}>
                    {c.plan}
                  </Badge>
                  <Badge
                    className={`border-0 text-xs ${
                      c.status === "active"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {c.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
