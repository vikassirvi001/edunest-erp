import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  CheckCircle,
  DollarSign,
  Download,
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
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  feePayments,
  monthlyFeeCollection,
  students,
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

const INPUT =
  "w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all";

export function FeeManagerDashboard({ section }: { section: string }) {
  const [search, setSearch] = useState("");
  const [amount, setAmount] = useState("");
  const [payMode, setPayMode] = useState("Online");
  const [txnId, setTxnId] = useState("");
  const [saved, setSaved] = useState(false);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 8;

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNumber.includes(search),
  );
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const thisMonthCollection = monthlyFeeCollection[5].collected;
  const pending = students.filter(
    (s) => s.feeStatus === "Pending" || s.feeStatus === "Partial",
  ).length;
  const todayPayments = feePayments.filter(
    (p) => p.date === "2024-03-25",
  ).length;
  const overdue = students.filter((s) => s.feeStatus === "Pending").length;

  if (section === "records") {
    return (
      <div className="p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-foreground">Fee Records</h2>
          <div className="flex gap-2">
            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-2 bg-muted text-muted-foreground rounded-xl text-sm hover:bg-muted/80 transition-colors"
              data-ocid="fee.export.button"
            >
              <Download className="w-4 h-4" /> Export
              <span className="text-xs bg-yellow-100 text-yellow-700 px-1.5 rounded-full">
                Demo
              </span>
            </button>
          </div>
        </div>
        <div className={CARD}>
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by name or roll number..."
            className={`${INPUT} mb-4`}
            data-ocid="fee.records.search_input"
          />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {[
                    "Student",
                    "Roll Number",
                    "Department",
                    "Total",
                    "Paid",
                    "Remaining",
                    "Status",
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
                {paged.map((s, i) => (
                  <tr
                    key={s.id}
                    className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                    data-ocid={`fee.records.row.${(page - 1) * PAGE_SIZE + i + 1}`}
                  >
                    <td className="py-3 pr-4 font-medium text-foreground whitespace-nowrap">
                      {s.name}
                    </td>
                    <td className="py-3 pr-4 text-muted-foreground font-mono text-xs">
                      {s.rollNumber}
                    </td>
                    <td className="py-3 pr-4 text-muted-foreground">
                      {s.department}
                    </td>
                    <td className="py-3 pr-4 text-foreground">
                      ₹{(s.totalFee / 1000).toFixed(0)}K
                    </td>
                    <td className="py-3 pr-4 text-green-600">
                      ₹{(s.paidFee / 1000).toFixed(0)}K
                    </td>
                    <td className="py-3 pr-4 text-red-500">
                      ₹{((s.totalFee - s.paidFee) / 1000).toFixed(0)}K
                    </td>
                    <td className="py-3">
                      <Badge
                        className={`border-0 text-xs ${
                          s.feeStatus === "Paid"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                            : s.feeStatus === "Partial"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {s.feeStatus}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">
              {filtered.length} students
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-xs bg-muted rounded-lg disabled:opacity-40"
                data-ocid="fee.records.pagination_prev"
              >
                Prev
              </button>
              <span className="text-xs text-foreground">
                {page}/{totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 text-xs bg-muted rounded-lg disabled:opacity-40"
                data-ocid="fee.records.pagination_next"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (section === "payments") {
    return (
      <div className="p-6 max-w-2xl mx-auto space-y-6">
        <h2 className="text-xl font-bold text-foreground">Add Payment</h2>
        <div className={CARD}>
          <div className="flex items-center gap-2 mb-5 px-3 py-2 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-xl">
            <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0" />
            <span className="text-sm text-yellow-700 dark:text-yellow-400">
              Demo Mode — payments are simulated
            </span>
          </div>
          <div className="space-y-4">
            <div>
              <span className="block text-sm font-medium text-foreground mb-1.5">
                Student Search
              </span>
              <input
                className={INPUT}
                placeholder="Search by name or roll number"
                data-ocid="fee.payment.search_input"
              />
            </div>
            <div>
              <span className="block text-sm font-medium text-foreground mb-1.5">
                Amount (₹)
              </span>
              <input
                className={INPUT}
                type="number"
                placeholder="e.g. 50000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                data-ocid="fee.payment.input"
              />
            </div>
            <div>
              <span className="block text-sm font-medium text-foreground mb-1.5">
                Payment Mode
              </span>
              <select
                className={INPUT}
                value={payMode}
                onChange={(e) => setPayMode(e.target.value)}
                data-ocid="fee.payment.select"
              >
                {["Cash", "Online", "DD", "Cheque"].map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <span className="block text-sm font-medium text-foreground mb-1.5">
                Transaction ID
              </span>
              <input
                className={INPUT}
                placeholder="TXN / DD / Cheque number"
                value={txnId}
                onChange={(e) => setTxnId(e.target.value)}
              />
            </div>
            <button
              type="button"
              onClick={() => {
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
              }}
              className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors"
              data-ocid="fee.payment.submit_button"
            >
              {saved ? (
                <span className="flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Payment Recorded (Demo)
                </span>
              ) : (
                "Record Payment"
              )}
            </button>
          </div>
        </div>

        <div className={CARD}>
          <h3 className="font-semibold text-foreground mb-4">
            Recent Payments
          </h3>
          <div className="space-y-3">
            {feePayments.slice(0, 6).map((p, i) => (
              <div
                key={p.id}
                className="flex items-center justify-between py-2 border-b border-border last:border-0"
                data-ocid={`fee.payments.row.${i + 1}`}
              >
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {p.studentName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {p.rollNumber} • {p.paymentMode} • {p.date}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">
                    ₹{p.amount.toLocaleString()}
                  </p>
                  <Badge
                    className={`border-0 text-xs ${
                      p.status === "Completed"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {p.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (section === "reports") {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Fee Reports</h2>
          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-2 bg-muted text-muted-foreground rounded-xl text-sm"
            data-ocid="fee.report.export.button"
          >
            <Download className="w-4 h-4" /> Export PDF
            <span className="text-xs bg-yellow-100 text-yellow-700 px-1.5 rounded-full">
              Demo
            </span>
          </button>
        </div>
        <div className={`${CARD}`}>
          <h3 className="font-semibold text-foreground mb-4">
            Monthly Collection Overview
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={monthlyFeeCollection}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`}
              />
              <Tooltip
                formatter={(v: number) => [`₹${v.toLocaleString()}`, ""]}
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "12px",
                }}
              />
              <Legend />
              <Bar
                dataKey="collected"
                name="Collected"
                fill="#0B2A57"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="pending"
                name="Pending"
                fill="#D1D5DB"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
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
          Fee Management Dashboard
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          Manage student fees, track payments, and generate reports
        </p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={TrendingUp}
          value={`₹${(thisMonthCollection / 100000).toFixed(1)}L`}
          label="Collection This Month"
          color="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
        />
        <StatCard
          icon={AlertCircle}
          value={String(pending)}
          label="Pending Dues"
          sub="students"
          color="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
        />
        <StatCard
          icon={Plus}
          value={String(todayPayments)}
          label="New Payments Today"
          color="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
        />
        <StatCard
          icon={Users}
          value={String(overdue)}
          label="Overdue Accounts"
          color="bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={CARD}>
          <h3 className="font-semibold text-foreground mb-4">
            Monthly Collection
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
                tick={{ fontSize: 11, fill: "oklch(var(--muted-foreground))" }}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "oklch(var(--muted-foreground))" }}
                tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`}
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
              <Bar
                dataKey="collected"
                name="Collected"
                fill="#0B2A57"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="pending"
                name="Pending"
                fill="#D1D5DB"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className={CARD}>
          <h3 className="font-semibold text-foreground mb-4">
            Recent Payments
          </h3>
          <div className="space-y-2.5">
            {feePayments.slice(0, 5).map((p, i) => (
              <div
                key={p.id}
                className="flex items-center justify-between py-2 border-b border-border last:border-0"
                data-ocid={`fee.payments.item.${i + 1}`}
              >
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {p.studentName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {p.date} • {p.paymentMode}
                  </p>
                </div>
                <span className="font-semibold text-sm text-foreground">
                  ₹{p.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
