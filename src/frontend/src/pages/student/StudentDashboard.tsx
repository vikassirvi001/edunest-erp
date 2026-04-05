import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  AlertCircle,
  BarChart2,
  Bell,
  BookOpen,
  Calendar,
  CheckCircle,
  ClipboardList,
  DollarSign,
  Download,
  FileText,
} from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "../../contexts/AuthContext";
import {
  assignments,
  examSchedules,
  notices,
  studentSubjectAttendance,
  students,
} from "../../data/seedData";

const CARD = "bg-card rounded-2xl border border-border shadow-card p-5";

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub?: string;
  color: string;
}) {
  return (
    <motion.div
      className={`${CARD} flex items-start gap-4`}
      whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.1)" }}
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

function QRCodePlaceholder({ rollNumber }: { rollNumber: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-28 h-28 bg-foreground/5 rounded-xl p-2 border border-border">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          aria-label="Student QR Code"
        >
          <title>Student QR Code</title>
          {[0, 1, 2, 3, 4, 5, 6].flatMap((r) =>
            [0, 1, 2, 3, 4, 5, 6].map((c) => {
              const isFinderCorner =
                (r < 3 && c < 3) || (r < 3 && c > 3) || (r > 3 && c < 3);
              const val = (r * 7 + c + r + c) % 3 === 0 || isFinderCorner;
              return val ? (
                <rect
                  key={`${r}-${c}`}
                  x={c * 14 + 1}
                  y={r * 14 + 1}
                  width={12}
                  height={12}
                  fill="currentColor"
                  className="text-foreground"
                  rx={1}
                />
              ) : null;
            }),
          )}
          <rect
            x={1}
            y={1}
            width={38}
            height={38}
            fill="none"
            stroke="currentColor"
            className="text-foreground"
            strokeWidth={4}
            rx={3}
          />
          <rect
            x={8}
            y={8}
            width={24}
            height={24}
            fill="currentColor"
            className="text-foreground"
            rx={2}
          />
          <rect
            x={57}
            y={1}
            width={38}
            height={38}
            fill="none"
            stroke="currentColor"
            className="text-foreground"
            strokeWidth={4}
            rx={3}
          />
          <rect
            x={64}
            y={8}
            width={24}
            height={24}
            fill="currentColor"
            className="text-foreground"
            rx={2}
          />
          <rect
            x={1}
            y={57}
            width={38}
            height={38}
            fill="none"
            stroke="currentColor"
            className="text-foreground"
            strokeWidth={4}
            rx={3}
          />
          <rect
            x={8}
            y={64}
            width={24}
            height={24}
            fill="currentColor"
            className="text-foreground"
            rx={2}
          />
        </svg>
      </div>
      <p className="text-xs text-muted-foreground font-mono">{rollNumber}</p>
    </div>
  );
}

export function StudentDashboard({ section }: { section: string }) {
  const { user } = useAuth();
  const student = students.find((s) => s.id === user?.id) ?? students[0];
  const studentNotices = notices
    .filter((n) => n.targetRoles.includes("student"))
    .slice(0, 5);
  const studentAssignments = assignments.filter(
    (a) =>
      a.department === student.department && a.semester === student.semester,
  );
  const studentExams = examSchedules.filter(
    (e) =>
      e.department === student.department && e.semester === student.semester,
  );
  const remaining = student.totalFee - student.paidFee;
  const paidPercent = Math.round((student.paidFee / student.totalFee) * 100);

  if (section === "fees") {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <h2 className="text-xl font-bold text-foreground">Fee Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            icon={FileText}
            label="Total Fee"
            value={`\u20b9${(student.totalFee / 1000).toFixed(0)}K`}
            color="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
          />
          <StatCard
            icon={CheckCircle}
            label="Paid"
            value={`\u20b9${(student.paidFee / 1000).toFixed(0)}K`}
            color="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
          />
          <StatCard
            icon={AlertCircle}
            label="Remaining"
            value={`\u20b9${(remaining / 1000).toFixed(0)}K`}
            color={
              remaining > 0
                ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                : "bg-green-100 text-green-600"
            }
          />
        </div>
        <div className={CARD}>
          <h3 className="font-semibold text-foreground mb-4">Fee Breakdown</h3>
          <div className="space-y-4">
            {[
              {
                label: "Tuition Fee",
                total: student.totalFee,
                paid: student.paidFee,
              },
              ...(student.hostFee > 0
                ? [
                    {
                      label: "Hostel Fee",
                      total: student.hostFee,
                      paid: student.paidHostFee,
                    },
                  ]
                : []),
              ...(student.busFee > 0
                ? [
                    {
                      label: "Bus Fee",
                      total: student.busFee,
                      paid: student.paidBusFee,
                    },
                  ]
                : []),
            ].map((fee) => {
              const p = Math.round((fee.paid / fee.total) * 100);
              return (
                <div key={fee.label}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium text-foreground">
                      {fee.label}
                    </span>
                    <span className="text-muted-foreground">
                      \u20b9{fee.paid.toLocaleString()} / \u20b9
                      {fee.total.toLocaleString()}
                    </span>
                  </div>
                  <Progress value={p} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {p}% paid
                  </p>
                </div>
              );
            })}
          </div>
        </div>
        <div className={CARD}>
          <h3 className="font-semibold text-foreground mb-3">
            Payment History
          </h3>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex justify-between items-center py-2 border-b border-border last:border-0"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Tuition Fee - Semester {i + 2}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    202{4 - i}-0{i + 1}-15 \u2022 Online Transfer
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">
                    \u20b9{(student.paidFee / 3).toLocaleString()}
                  </p>
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-0 text-xs">
                    Paid
                  </Badge>
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
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <h2 className="text-xl font-bold text-foreground">Attendance</h2>
        <div className={CARD}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-3xl font-bold text-foreground">
                {student.attendancePercent}%
              </p>
              <p className="text-sm text-muted-foreground mt-0.5">
                Overall Attendance
              </p>
            </div>
            <div
              className={`px-3 py-1.5 rounded-full text-sm font-semibold ${
                student.attendancePercent >= 75
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {student.attendancePercent >= 75
                ? "Good Standing"
                : "Attendance Shortage"}
            </div>
          </div>
          <Progress value={student.attendancePercent} className="h-3" />
          <p className="text-xs text-muted-foreground mt-2">
            Minimum required: 75%
          </p>
        </div>
        <div className={CARD}>
          <h3 className="font-semibold text-foreground mb-4">
            Subject-wise Attendance
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 text-muted-foreground font-medium">
                    Subject
                  </th>
                  <th className="text-center py-2 text-muted-foreground font-medium">
                    Present
                  </th>
                  <th className="text-center py-2 text-muted-foreground font-medium">
                    Total
                  </th>
                  <th className="text-center py-2 text-muted-foreground font-medium">
                    %
                  </th>
                  <th className="text-right py-2 text-muted-foreground font-medium">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {studentSubjectAttendance.map((s) => (
                  <tr
                    key={s.subject}
                    className="border-b border-border last:border-0"
                  >
                    <td className="py-3 font-medium text-foreground">
                      {s.subject}
                    </td>
                    <td className="py-3 text-center text-foreground">
                      {s.present}
                    </td>
                    <td className="py-3 text-center text-muted-foreground">
                      {s.total}
                    </td>
                    <td className="py-3 text-center font-semibold text-foreground">
                      {s.percent}%
                    </td>
                    <td className="py-3 text-right">
                      <Badge
                        className={`border-0 text-xs ${
                          s.percent >= 75
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {s.percent >= 75 ? "Good" : "Low"}
                      </Badge>
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

  if (section === "notices") {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-4">
        <h2 className="text-xl font-bold text-foreground">Notices</h2>
        {studentNotices.map((n) => (
          <motion.div
            key={n.id}
            className={CARD}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                {n.pinned && (
                  <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 border-0 text-xs mb-2">
                    Pinned
                  </Badge>
                )}
                <h3 className="font-semibold text-foreground">{n.title}</h3>
                <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                  {n.content}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border">
              <span className="text-xs text-muted-foreground">{n.author}</span>
              <span className="text-xs text-muted-foreground">
                \u2022 {n.date}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (section === "exams") {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-4">
        <h2 className="text-xl font-bold text-foreground">Exam Schedule</h2>
        <div className={CARD}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["Subject", "Date", "Time", "Duration", "Room"].map((h) => (
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
                {studentExams.map((e) => (
                  <tr
                    key={e.id}
                    className="border-b border-border last:border-0"
                  >
                    <td className="py-3 pr-4 font-medium text-foreground">
                      {e.subject}
                    </td>
                    <td className="py-3 pr-4 text-foreground">{e.date}</td>
                    <td className="py-3 pr-4 text-foreground">{e.time}</td>
                    <td className="py-3 pr-4 text-muted-foreground">
                      {e.duration}
                    </td>
                    <td className="py-3 text-muted-foreground">{e.room}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  if (section === "assignments") {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-4">
        <h2 className="text-xl font-bold text-foreground">Assignments</h2>
        {studentAssignments.map((a, i) => (
          <motion.div
            key={a.id}
            className={CARD}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h3 className="font-semibold text-foreground">{a.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {a.subject} \u2022 {a.teacherName}
                </p>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  {a.description}
                </p>
              </div>
              <div className="flex-shrink-0 text-right">
                <Badge
                  className={`border-0 text-xs ${
                    i % 3 === 0
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {i % 3 === 0 ? "Submitted" : "Pending"}
                </Badge>
                <p className="text-xs text-muted-foreground mt-1.5">
                  Due: {a.dueDate}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (section === "documents") {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-4">
        <h2 className="text-xl font-bold text-foreground">Documents</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { name: "Student ID Card", type: "PDF" },
            { name: "Fee Receipt - Semester 5", type: "PDF" },
            { name: "Marksheet - Semester 4", type: "PDF" },
            { name: "Bonafide Certificate", type: "PDF" },
          ].map((doc) => (
            <div
              key={doc.name}
              className={`${CARD} flex items-center justify-between`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">
                    {doc.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{doc.type}</p>
                </div>
              </div>
              <button
                type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-medium hover:bg-primary/20 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Download
              </button>
            </div>
          ))}
        </div>
        <div
          className={`${CARD} flex items-center gap-3 bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800`}
        >
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
          <p className="text-sm text-yellow-700 dark:text-yellow-400">
            Document downloads are in Demo Mode. In production, actual PDFs will
            be generated.
          </p>
        </div>
      </div>
    );
  }

  // Default dashboard
  return (
    <div className="p-6 space-y-6">
      <motion.div
        className={`${CARD} bg-gradient-to-r from-primary/10 to-accent flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <p className="text-muted-foreground text-sm">Good Morning</p>
          <h2 className="text-xl font-bold text-foreground mt-0.5">
            {student.name}
          </h2>
          <div className="flex flex-wrap gap-3 mt-2">
            <span className="text-xs text-muted-foreground bg-background rounded-full px-2.5 py-1">
              {student.rollNumber}
            </span>
            <span className="text-xs text-muted-foreground bg-background rounded-full px-2.5 py-1">
              {student.department}
            </span>
            <span className="text-xs text-muted-foreground bg-background rounded-full px-2.5 py-1">
              Semester {student.semester}
            </span>
          </div>
        </div>
        <QRCodePlaceholder rollNumber={student.rollNumber} />
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={BarChart2}
          label="Attendance"
          value={`${student.attendancePercent}%`}
          sub="This semester"
          color="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
        />
        <StatCard
          icon={BookOpen}
          label="Subjects"
          value="5"
          sub="This semester"
          color="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
        />
        <StatCard
          icon={ClipboardList}
          label="Pending Assignments"
          value={String(
            studentAssignments.filter((_, i) => i % 3 !== 0).length,
          )}
          color="bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400"
        />
        <StatCard
          icon={AlertCircle}
          label="Fee Status"
          value={`${paidPercent}%`}
          sub="Paid"
          color={
            paidPercent >= 100
              ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
              : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={CARD}>
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-primary" /> Upcoming
            Assignments
          </h3>
          <div className="space-y-3">
            {studentAssignments.slice(0, 3).map((a, i) => (
              <div
                key={a.id}
                className="flex items-start justify-between gap-3 py-2 border-b border-border last:border-0"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {a.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {a.subject}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <Badge
                    className={`border-0 text-xs ${
                      i === 0
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {i === 0 ? "Submitted" : "Pending"}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    {a.dueDate}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={CARD}>
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Bell className="w-4 h-4 text-primary" /> Recent Notices
          </h3>
          <div className="space-y-3">
            {studentNotices.slice(0, 3).map((n) => (
              <div
                key={n.id}
                className="py-2 border-b border-border last:border-0"
              >
                <div className="flex items-center gap-2 mb-1">
                  {n.pinned && (
                    <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 border-0 text-xs">
                      Pinned
                    </Badge>
                  )}
                  <p className="text-sm font-medium text-foreground">
                    {n.title}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  {n.date} \u2022 {n.author}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className={CARD}>
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" /> Upcoming Exams
          </h3>
          <div className="space-y-2">
            {studentExams.slice(0, 4).map((e) => (
              <div
                key={e.id}
                className="flex items-center justify-between py-2 border-b border-border last:border-0"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {e.subject}
                  </p>
                  <p className="text-xs text-muted-foreground">{e.room}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-foreground">
                    {e.date}
                  </p>
                  <p className="text-xs text-muted-foreground">{e.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={CARD}>
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-primary" /> Fee Summary
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Total Fee</span>
              <span className="font-semibold text-foreground">
                \u20b9{student.totalFee.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Paid</span>
              <span className="font-semibold text-green-600">
                \u20b9{student.paidFee.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Remaining</span>
              <span
                className={`font-semibold ${remaining > 0 ? "text-red-500" : "text-green-600"}`}
              >
                \u20b9{remaining.toLocaleString()}
              </span>
            </div>
            <Progress value={paidPercent} className="h-2 mt-2" />
            <Badge
              className={`border-0 ${
                student.feeStatus === "Paid"
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                  : student.feeStatus === "Partial"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
              }`}
            >
              {student.feeStatus}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
