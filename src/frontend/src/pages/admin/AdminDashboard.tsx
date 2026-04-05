import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  AlertCircle,
  Bell,
  Building2,
  CheckCircle,
  GraduationCap,
  Plus,
  Settings,
  Shield,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useRegistration } from "../../contexts/RegistrationContext";
import {
  departments,
  notices,
  students,
  teachers,
  users,
} from "../../data/seedData";
import { AdminStudents } from "./AdminStudents";

const CARD = "bg-card rounded-2xl border border-border shadow-card p-5";
const INPUT =
  "w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all";

function StatCard({
  icon: Icon,
  value,
  label,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  label: string;
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
        <p className="text-xs font-medium text-muted-foreground mt-0.5">
          {label}
        </p>
      </div>
    </motion.div>
  );
}

export function AdminDashboard({ section }: { section: string }) {
  const { user } = useAuth();
  const { selfRegistrationEnabled, toggleSelfRegistration, registrations } =
    useRegistration();
  const [saved, setSaved] = useState<string | null>(null);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "student",
    department: "",
  });
  const [resetSearch, setResetSearch] = useState("");
  const [pinned, setPinned] = useState<Record<string, boolean>>(
    Object.fromEntries(notices.map((n) => [n.id, n.pinned])),
  );

  const showSaved = (key: string) => {
    setSaved(key);
    setTimeout(() => setSaved(null), 2500);
  };

  const roleColors: Record<string, string> = {
    student: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    teacher:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    feeManager: "bg-yellow-100 text-yellow-700",
    principal: "bg-purple-100 text-purple-700",
    admin: "bg-orange-100 text-orange-700",
    superAdmin: "bg-red-100 text-red-700",
  };

  if (section === "students") {
    return <AdminStudents />;
  }

  if (section === "users") {
    return (
      <div className="p-6 space-y-6">
        <h2 className="text-xl font-bold text-foreground">User Management</h2>

        <div className={CARD}>
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Plus className="w-4 h-4 text-primary" /> Add New User
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="block text-xs font-medium text-muted-foreground mb-1.5">
                Full Name
              </span>
              <input
                className={INPUT}
                placeholder="Enter full name"
                value={newUser.name}
                onChange={(e) =>
                  setNewUser((p) => ({ ...p, name: e.target.value }))
                }
                data-ocid="admin.user.input"
              />
            </div>
            <div>
              <span className="block text-xs font-medium text-muted-foreground mb-1.5">
                Email
              </span>
              <input
                className={INPUT}
                type="email"
                placeholder="email@aits.edu"
              />
            </div>
            <div>
              <span className="block text-xs font-medium text-muted-foreground mb-1.5">
                Role
              </span>
              <select
                className={INPUT}
                value={newUser.role}
                onChange={(e) =>
                  setNewUser((p) => ({ ...p, role: e.target.value }))
                }
                data-ocid="admin.user.select"
              >
                {["student", "teacher", "feeManager", "principal", "admin"].map(
                  (r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ),
                )}
              </select>
            </div>
            <div>
              <span className="block text-xs font-medium text-muted-foreground mb-1.5">
                Department
              </span>
              <select className={INPUT}>
                <option>Select department</option>
                {departments.map((d) => (
                  <option key={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
          </div>
          <button
            type="button"
            onClick={() => showSaved("user")}
            className="mt-4 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors"
            data-ocid="admin.user.submit_button"
          >
            {saved === "user" ? (
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> User Created!
              </span>
            ) : (
              "Create User"
            )}
          </button>
        </div>

        <div className={CARD}>
          <h3 className="font-semibold text-foreground mb-4">All Users</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["Name", "Email/Mobile", "Role", "Department", "Status"].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left py-2 pr-4 text-muted-foreground font-medium"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {[
                  ...users,
                  ...teachers.slice(0, 5).map((t) => ({
                    id: t.id,
                    name: t.name,
                    role: "teacher" as const,
                    email: t.email,
                    collegeId: t.collegeId,
                    password: "",
                    department: t.department,
                  })),
                ]
                  .slice(0, 12)
                  .map((u, i) => (
                    <tr
                      key={u.id}
                      className="border-b border-border last:border-0"
                      data-ocid={`admin.users.row.${i + 1}`}
                    >
                      <td className="py-2.5 pr-4 font-medium text-foreground">
                        {u.name}
                      </td>
                      <td className="py-2.5 pr-4 text-muted-foreground text-xs">
                        {u.email ?? (u as { mobile?: string }).mobile ?? "-"}
                      </td>
                      <td className="py-2.5 pr-4">
                        <Badge
                          className={`border-0 text-xs ${roleColors[u.role] ?? ""}`}
                        >
                          {u.role}
                        </Badge>
                      </td>
                      <td className="py-2.5 pr-4 text-muted-foreground">
                        {u.department ?? "-"}
                      </td>
                      <td className="py-2.5">
                        <span className="text-xs font-medium text-green-600">
                          Active
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

  if (section === "departments") {
    return (
      <div className="p-6 space-y-6">
        <h2 className="text-xl font-bold text-foreground">
          Department Management
        </h2>
        <div className={CARD}>
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Plus className="w-4 h-4 text-primary" /> Add Department
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              className={INPUT}
              placeholder="Department Name"
              data-ocid="admin.department.input"
            />
            <input className={INPUT} placeholder="Short Name (e.g. CSE)" />
          </div>
          <button
            type="button"
            onClick={() => showSaved("dept")}
            className="mt-4 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors"
            data-ocid="admin.department.submit_button"
          >
            {saved === "dept" ? "Department Added!" : "Add Department"}
          </button>
        </div>
        <div className={CARD}>
          <div className="space-y-3">
            {departments.map((d, i) => (
              <div
                key={d.id}
                className="flex items-center justify-between py-3 border-b border-border last:border-0"
                data-ocid={`admin.departments.item.${i + 1}`}
              >
                <div>
                  <p className="font-medium text-foreground">{d.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {d.studentCount} students • {d.teacherCount} teachers
                  </p>
                </div>
                <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-0">
                  {d.shortName}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (section === "notices") {
    return (
      <div className="p-6 space-y-4">
        <h2 className="text-xl font-bold text-foreground">Notice Management</h2>
        {notices.map((n, i) => (
          <div
            key={n.id}
            className={CARD}
            data-ocid={`admin.notices.item.${i + 1}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-semibold text-foreground">{n.title}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {n.content.slice(0, 100)}...
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {n.author} • {n.date}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setPinned((p) => ({ ...p, [n.id]: !p[n.id] }))}
                  className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
                    pinned[n.id]
                      ? "bg-red-100 text-red-700"
                      : "bg-muted text-muted-foreground hover:bg-red-100 hover:text-red-700"
                  }`}
                  data-ocid={`admin.notices.pin.${i + 1}`}
                >
                  {pinned[n.id] ? "Pinned" : "Pin"}
                </button>
                <button
                  type="button"
                  className="text-xs px-2.5 py-1 rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                  data-ocid={`admin.notices.delete_button.${i + 1}`}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (section === "settings") {
    return (
      <div className="p-6 max-w-2xl mx-auto space-y-6">
        <h2 className="text-xl font-bold text-foreground">System Settings</h2>
        <div className={CARD}>
          <div className="flex items-center gap-2 mb-5 px-3 py-2 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-xl">
            <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0" />
            <span className="text-sm text-yellow-700 dark:text-yellow-400">
              Demo Mode — settings changes are simulated
            </span>
          </div>
          <div className="space-y-4">
            <div>
              <span className="block text-sm font-medium text-foreground mb-1.5">
                College Name
              </span>
              <input
                className={INPUT}
                defaultValue={user?.college?.name}
                data-ocid="admin.settings.input"
              />
            </div>
            <div>
              <span className="block text-sm font-medium text-foreground mb-1.5">
                Contact Email
              </span>
              <input
                className={INPUT}
                defaultValue="info@aits.edu.in"
                type="email"
              />
            </div>
            <div>
              <span className="block text-sm font-medium text-foreground mb-1.5">
                Phone
              </span>
              <input className={INPUT} defaultValue="+91 294 2450123" />
            </div>
            <div>
              <span className="block text-sm font-medium text-foreground mb-1.5">
                Website
              </span>
              <input className={INPUT} defaultValue="www.aits.edu.in" />
            </div>

            {/* Student Self-Registration Toggle */}
            <div className="flex items-center justify-between px-4 py-4 bg-muted rounded-xl border border-border">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Allow Student Self Registration
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  When enabled, a registration link appears on the login page
                </p>
              </div>
              <Switch
                checked={selfRegistrationEnabled}
                onCheckedChange={toggleSelfRegistration}
                data-ocid="admin.settings.registration.switch"
              />
            </div>

            <button
              type="button"
              onClick={() => showSaved("settings")}
              className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors"
              data-ocid="admin.settings.save_button"
            >
              {saved === "settings"
                ? "Settings Saved! (Demo)"
                : "Save Settings"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (section === "security") {
    return (
      <div className="p-6 max-w-2xl mx-auto space-y-6">
        <h2 className="text-xl font-bold text-foreground">Password Reset</h2>
        <div className={CARD}>
          <div className="flex items-center gap-2 mb-5 px-3 py-2 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-xl">
            <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0" />
            <span className="text-sm text-yellow-700 dark:text-yellow-400">
              Demo Mode — password reset is simulated
            </span>
          </div>
          <div className="space-y-4">
            <div>
              <span className="block text-sm font-medium text-foreground mb-1.5">
                Search User
              </span>
              <input
                className={INPUT}
                placeholder="Search by name or email"
                value={resetSearch}
                onChange={(e) => setResetSearch(e.target.value)}
                data-ocid="admin.security.search_input"
              />
            </div>
            {resetSearch && (
              <div className="space-y-2">
                {[...users, ...teachers]
                  .filter((u) =>
                    u.name.toLowerCase().includes(resetSearch.toLowerCase()),
                  )
                  .slice(0, 3)
                  .map((u) => (
                    <div
                      key={u.id}
                      className="flex items-center justify-between px-4 py-3 bg-muted rounded-xl"
                    >
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {u.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {u.email ?? ""}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => showSaved(`reset-${u.id}`)}
                        className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium"
                        data-ocid="admin.security.submit_button"
                      >
                        {saved === `reset-${u.id}`
                          ? "Reset!"
                          : "Reset Password"}
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Dashboard
  const pendingCount = registrations.filter(
    (r) => r.status === "pending",
  ).length;

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-xl font-bold text-foreground">Admin Dashboard</h2>
        <p className="text-muted-foreground text-sm mt-1">
          {user?.college?.name}
        </p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          value={String(students.length + teachers.length + 3)}
          label="Total Users"
          color="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
        />
        <StatCard
          icon={GraduationCap}
          value={String(students.length)}
          label="Students"
          color="bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
        />
        <StatCard
          icon={Bell}
          value={String(notices.length)}
          label="Active Notices"
          color="bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400"
        />
        <StatCard
          icon={Settings}
          value="v2.1"
          label="System Version"
          color="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
        />
      </div>

      {pendingCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 px-4 py-3 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-xl"
          data-ocid="admin.dashboard.pending_state"
        >
          <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0" />
          <p className="text-sm text-yellow-700 dark:text-yellow-400">
            <strong>
              {pendingCount} student registration{pendingCount > 1 ? "s" : ""}
            </strong>{" "}
            awaiting approval.
          </p>
          <span className="ml-auto text-xs text-yellow-600 font-medium cursor-pointer hover:underline">
            View →
          </span>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={CARD}>
          <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                label: "Manage Students",
                icon: GraduationCap,
                key: "students",
                color:
                  "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400",
              },
              {
                label: "Add User",
                icon: Users,
                key: "users",
                color:
                  "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
              },
              {
                label: "Add Department",
                icon: Building2,
                key: "departments",
                color: "bg-green-100 text-green-600",
              },
              {
                label: "Post Notice",
                icon: Bell,
                key: "notices",
                color: "bg-yellow-100 text-yellow-600",
              },
              {
                label: "Reset Password",
                icon: Shield,
                key: "security",
                color: "bg-purple-100 text-purple-600",
              },
            ].map((qa) => (
              <button
                type="button"
                key={qa.key}
                className="flex items-center gap-3 p-4 rounded-xl bg-muted hover:bg-muted/80 transition-colors text-left"
                data-ocid={`admin.dashboard.${qa.key}.button`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${qa.color}`}
                >
                  <qa.icon className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-foreground">
                  {qa.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className={CARD}>
          <h3 className="font-semibold text-foreground mb-4">Recent Notices</h3>
          <div className="space-y-3">
            {notices.slice(0, 4).map((n, i) => (
              <div
                key={n.id}
                className="flex items-start justify-between gap-3 py-2 border-b border-border last:border-0"
                data-ocid={`admin.dashboard.notices.item.${i + 1}`}
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {n.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {n.author} • {n.date}
                  </p>
                </div>
                {n.pinned && (
                  <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full flex-shrink-0">
                    Pinned
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
