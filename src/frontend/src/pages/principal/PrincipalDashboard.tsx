import { BarChart2, DollarSign, GraduationCap, Users } from "lucide-react";
import { motion } from "motion/react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAuth } from "../../contexts/AuthContext";
import {
  attendanceChartData,
  departmentAttendance,
  monthlyFeeCollection,
  notices,
  students,
  teachers,
} from "../../data/seedData";

const CARD = "bg-card rounded-2xl border border-border shadow-card p-5";

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

const PIE_COLORS = ["#0B2A57", "#D1D5DB"];

export function PrincipalDashboard({ section }: { section: string }) {
  const { user } = useAuth();
  const totalPaid = students.reduce((sum, s) => sum + s.paidFee, 0);
  const totalFee = students.reduce((sum, s) => sum + s.totalFee, 0);
  const avgAttendance = Math.round(
    students.reduce((sum, s) => sum + s.attendancePercent, 0) / students.length,
  );
  const pieData = [
    { name: "Collected", value: totalPaid },
    { name: "Pending", value: totalFee - totalPaid },
  ];

  if (section === "students") {
    return (
      <div className="p-6 space-y-4">
        <h2 className="text-xl font-bold text-foreground">Students Overview</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {["CSE", "AI & ML", "Civil", "Mech"].map((dept) => {
            const count = students.filter((s) => s.department === dept).length;
            return (
              <div key={dept} className={`${CARD} text-center`}>
                <p className="text-2xl font-bold text-foreground">{count}</p>
                <p className="text-xs text-muted-foreground mt-1">{dept}</p>
              </div>
            );
          })}
        </div>
        <div className={CARD}>
          <h3 className="font-semibold text-foreground mb-4">All Students</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {[
                    "Name",
                    "Roll",
                    "Dept",
                    "Sem",
                    "Attendance",
                    "Fee Status",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left py-2 pr-4 text-muted-foreground font-medium"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.slice(0, 15).map((s, i) => (
                  <tr
                    key={s.id}
                    className="border-b border-border last:border-0"
                    data-ocid={`principal.students.row.${i + 1}`}
                  >
                    <td className="py-2.5 pr-4 font-medium text-foreground">
                      {s.name}
                    </td>
                    <td className="py-2.5 pr-4 text-muted-foreground text-xs font-mono">
                      {s.rollNumber}
                    </td>
                    <td className="py-2.5 pr-4 text-muted-foreground">
                      {s.department}
                    </td>
                    <td className="py-2.5 pr-4 text-muted-foreground">
                      {s.semester}
                    </td>
                    <td className="py-2.5 pr-4">
                      <span
                        className={`text-xs font-semibold ${s.attendancePercent >= 75 ? "text-green-600" : "text-red-500"}`}
                      >
                        {s.attendancePercent}%
                      </span>
                    </td>
                    <td className="py-2.5">
                      <span
                        className={`text-xs font-semibold ${
                          s.feeStatus === "Paid"
                            ? "text-green-600"
                            : s.feeStatus === "Partial"
                              ? "text-yellow-600"
                              : "text-red-500"
                        }`}
                      >
                        {s.feeStatus}
                      </span>
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

  if (section === "teachers") {
    return (
      <div className="p-6 space-y-4">
        <h2 className="text-xl font-bold text-foreground">
          Teacher Activities
        </h2>
        <div className={CARD}>
          <div className="space-y-3">
            {teachers.map((t, i) => (
              <div
                key={t.id}
                className="flex items-start justify-between gap-4 py-2.5 border-b border-border last:border-0"
                data-ocid={`principal.teachers.row.${i + 1}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary text-xs font-bold">
                      {t.name
                        .split(" ")
                        .map((w) => w[0])
                        .join("")
                        .slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {t.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t.designation} • {t.department}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">
                    {t.subjects.join(", ")}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {t.experience} yrs exp
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (section === "attendance") {
    return (
      <div className="p-6 space-y-6">
        <h2 className="text-xl font-bold text-foreground">
          Attendance Analytics
        </h2>
        <div className={CARD}>
          <h3 className="font-semibold text-foreground mb-4">
            Last 7 Days Attendance Trend
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart
              data={attendanceChartData}
              margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(var(--border))"
              />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 12, fill: "oklch(var(--muted-foreground))" }}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 12, fill: "oklch(var(--muted-foreground))" }}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip
                formatter={(v: number) => [`${v}%`, "Attendance"]}
                contentStyle={{
                  background: "oklch(var(--card))",
                  border: "1px solid oklch(var(--border))",
                  borderRadius: "12px",
                  fontSize: "12px",
                }}
              />
              <Line
                type="monotone"
                dataKey="attendance"
                stroke="#2F80ED"
                strokeWidth={2.5}
                dot={{ fill: "#2F80ED", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className={CARD}>
          <h3 className="font-semibold text-foreground mb-4">
            Department-wise Attendance
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={departmentAttendance}
              margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(var(--border))"
              />
              <XAxis
                dataKey="dept"
                tick={{ fontSize: 12, fill: "oklch(var(--muted-foreground))" }}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 12, fill: "oklch(var(--muted-foreground))" }}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip
                formatter={(v: number) => [`${v}%`, "Attendance"]}
                contentStyle={{
                  background: "oklch(var(--card))",
                  border: "1px solid oklch(var(--border))",
                  borderRadius: "12px",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="attendance" fill="#2F80ED" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  if (section === "fees") {
    return (
      <div className="p-6 space-y-6">
        <h2 className="text-xl font-bold text-foreground">Fee Report</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={CARD}>
            <h3 className="font-semibold text-foreground mb-4">
              Collection Status
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {pieData.map((entry, idx) => (
                    <Cell key={entry.name} fill={PIE_COLORS[idx % 2]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip
                  formatter={(v: number) => [`₹${v.toLocaleString()}`]}
                  contentStyle={{
                    background: "oklch(var(--card))",
                    border: "1px solid oklch(var(--border))",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className={CARD}>
            <h3 className="font-semibold text-foreground mb-4">
              Monthly Trend
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={monthlyFeeCollection}
                margin={{ top: 5, right: 5, left: 0, bottom: 0 }}
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
                  tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`}
                />
                <Tooltip
                  formatter={(v: number) => [`₹${v.toLocaleString()}`]}
                  contentStyle={{
                    background: "oklch(var(--card))",
                    border: "1px solid oklch(var(--border))",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="collected" fill="#0B2A57" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  }

  if (section === "notices") {
    return (
      <div className="p-6 space-y-4">
        <h2 className="text-xl font-bold text-foreground">Notice Board</h2>
        {notices.map((n, i) => (
          <div
            key={n.id}
            className={CARD}
            data-ocid={`principal.notices.item.${i + 1}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-foreground">{n.title}</p>
                <p className="text-sm text-muted-foreground mt-1.5">
                  {n.content}
                </p>
              </div>
              {n.pinned && (
                <span className="flex-shrink-0 text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full">
                  Pinned
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border">
              <span className="text-xs text-muted-foreground">
                {n.author} ({n.authorRole})
              </span>
              <span className="text-xs text-muted-foreground">• {n.date}</span>
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
        <h2 className="text-xl font-bold text-foreground">
          Good Morning, {user?.name}
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          {user?.college?.name}
        </p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={GraduationCap}
          value={String(students.length)}
          label="Total Students"
          color="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
        />
        <StatCard
          icon={Users}
          value={String(teachers.length)}
          label="Total Teachers"
          color="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
        />
        <StatCard
          icon={BarChart2}
          value={`${avgAttendance}%`}
          label="Today's Attendance"
          color="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
        />
        <StatCard
          icon={DollarSign}
          value={`₹${(monthlyFeeCollection[5].collected / 100000).toFixed(1)}L`}
          label="Fee Collection"
          sub="This month"
          color="bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={CARD}>
          <h3 className="font-semibold text-foreground mb-4">
            Attendance Trend (Last 7 Days)
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart
              data={attendanceChartData}
              margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(var(--border))"
              />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11, fill: "oklch(var(--muted-foreground))" }}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 11, fill: "oklch(var(--muted-foreground))" }}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip
                formatter={(v: number) => [`${v}%`, "Attendance"]}
                contentStyle={{
                  background: "oklch(var(--card))",
                  border: "1px solid oklch(var(--border))",
                  borderRadius: "12px",
                  fontSize: "12px",
                }}
              />
              <Line
                type="monotone"
                dataKey="attendance"
                stroke="#2F80ED"
                strokeWidth={2.5}
                dot={{ fill: "#2F80ED", r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className={CARD}>
          <h3 className="font-semibold text-foreground mb-4">
            Fee Collection Status
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={70}
                dataKey="value"
              >
                {pieData.map((entry, idx) => (
                  <Cell key={entry.name} fill={PIE_COLORS[idx % 2]} />
                ))}
              </Pie>
              <Legend
                formatter={(v) => (
                  <span className="text-xs text-foreground">{v}</span>
                )}
              />
              <Tooltip
                formatter={(v: number) => [`₹${v.toLocaleString()}`]}
                contentStyle={{
                  background: "oklch(var(--card))",
                  border: "1px solid oklch(var(--border))",
                  borderRadius: "12px",
                  fontSize: "12px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className={CARD}>
          <h3 className="font-semibold text-foreground mb-4">
            Recent Teacher Activities
          </h3>
          <div className="space-y-3">
            {teachers.slice(0, 5).map((t, i) => (
              <div
                key={t.id}
                className="flex items-center gap-3 py-2 border-b border-border last:border-0"
                data-ocid={`principal.activity.item.${i + 1}`}
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary text-xs font-bold">
                    {t.name
                      .split(" ")
                      .map((w) => w[0])
                      .join("")
                      .slice(0, 2)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {t.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Uploaded notes for {t.subjects[0]}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground flex-shrink-0">
                  2h ago
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className={CARD}>
          <h3 className="font-semibold text-foreground mb-4">Recent Notices</h3>
          <div className="space-y-3">
            {notices.slice(0, 4).map((n, i) => (
              <div
                key={n.id}
                className="py-2 border-b border-border last:border-0"
                data-ocid={`principal.notices.item.${i + 1}`}
              >
                <p className="text-sm font-medium text-foreground">{n.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {n.author} • {n.date}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
