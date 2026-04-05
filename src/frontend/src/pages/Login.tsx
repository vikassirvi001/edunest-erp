import {
  AlertCircle,
  Eye,
  EyeOff,
  GraduationCap,
  UserPlus,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useRegistration } from "../contexts/RegistrationContext";
import type { UserRole } from "../data/seedData";

interface LoginProps {
  onShowRegistration: () => void;
}

export function Login({ onShowRegistration }: LoginProps) {
  const { login, loginAsDemo } = useAuth();
  const { selfRegistrationEnabled } = useRegistration();
  const [tab, setTab] = useState<"student" | "staff" | "demo">("demo");
  const [mobile, setMobile] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setError("");
    setLoading(true);
    setTimeout(() => {
      const result = login({
        loginType: tab as "student" | "staff",
        mobile: tab === "student" ? mobile : undefined,
        rollNumber: tab === "student" ? rollNumber : undefined,
        email: tab === "staff" ? email : undefined,
        password,
      });
      if (!result.success) setError(result.error ?? "Login failed");
      setLoading(false);
    }, 600);
  };

  const demoRoles: {
    role: UserRole;
    label: string;
    color: string;
    desc: string;
  }[] = [
    {
      role: "student",
      label: "Student",
      color: "bg-blue-500",
      desc: "Rahul Sharma • CSE Sem 5",
    },
    {
      role: "teacher",
      label: "Teacher",
      color: "bg-green-500",
      desc: "Prof. Anita Verma • CSE",
    },
    {
      role: "feeManager",
      label: "Fee Manager",
      color: "bg-yellow-500",
      desc: "Rajesh Kumar • Finance",
    },
    {
      role: "principal",
      label: "Principal",
      color: "bg-purple-500",
      desc: "Dr. Suresh Patel • AITS",
    },
    {
      role: "admin",
      label: "Admin",
      color: "bg-orange-500",
      desc: "Amit Singh • College Admin",
    },
    {
      role: "superAdmin",
      label: "Super Admin",
      color: "bg-red-500",
      desc: "Platform Owner • EduNest",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel */}
      <div
        className="hidden lg:flex w-2/5 xl:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #0B2A57 0%, #061A3A 50%, #0B2A57 100%)",
        }}
      >
        {/* Grid background */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-lg leading-tight">
                EduNest ERP
              </p>
              <p className="text-white/50 text-xs">
                College Management Platform
              </p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-3xl xl:text-4xl font-bold text-white leading-tight mb-4">
              Manage your college
              <br />
              <span className="text-primary">smarter & faster</span>
            </h2>
            <p className="text-white/60 text-base leading-relaxed max-w-sm">
              A complete ERP solution for colleges — students, faculty, fees,
              attendance, and more in one unified platform.
            </p>
          </motion.div>
        </div>

        <div className="relative grid grid-cols-2 gap-3">
          {[
            { label: "1,240+", sub: "Students" },
            { label: "15+", sub: "Departments" },
            { label: "68", sub: "Faculty Members" },
            { label: "4", sub: "Colleges on Platform" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="bg-white/8 rounded-xl p-4 border border-white/10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.05 }}
            >
              <p className="text-white font-bold text-xl">{stat.label}</p>
              <p className="text-white/50 text-xs mt-0.5">{stat.sub}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-foreground">EduNest ERP</span>
          </div>

          <div className="mb-7">
            <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Sign in to access your dashboard
            </p>
          </div>

          {/* Tabs */}
          <div
            className="flex bg-muted rounded-xl p-1 mb-6"
            data-ocid="login.tab"
          >
            {(["demo", "student", "staff"] as const).map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => {
                  setTab(t);
                  setError("");
                }}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
                  tab === t
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                data-ocid={`login.${t}.tab`}
              >
                {t === "demo" ? (
                  <span className="flex items-center justify-center gap-1">
                    <Zap className="w-3.5 h-3.5" /> Quick Demo
                  </span>
                ) : t === "student" ? (
                  "Student"
                ) : (
                  "Staff"
                )}
              </button>
            ))}
          </div>

          {/* Demo Tab */}
          {tab === "demo" && (
            <div className="space-y-2.5">
              <p className="text-xs text-muted-foreground mb-3">
                Select a role to instantly preview that dashboard:
              </p>
              {demoRoles.map(({ role, label, color, desc }) => (
                <motion.button
                  key={role}
                  onClick={() => loginAsDemo(role)}
                  className="w-full flex items-center gap-3 p-3.5 bg-card border border-border rounded-xl hover:border-primary/40 hover:shadow-card transition-all group"
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  data-ocid={`login.demo_${role}.button`}
                >
                  <div
                    className={`w-9 h-9 rounded-lg ${color} flex items-center justify-center flex-shrink-0`}
                  >
                    <span className="text-white font-bold text-xs">
                      {label[0]}
                    </span>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-sm text-foreground">
                      {label}
                    </p>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                  <div className="ml-auto text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    <Zap className="w-4 h-4" />
                  </div>
                </motion.button>
              ))}
            </div>
          )}

          {/* Student Tab */}
          {tab === "student" && (
            <div className="space-y-4">
              <div>
                <span className="block text-sm font-medium text-foreground mb-1.5">
                  Mobile Number
                </span>
                <input
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="Enter your mobile number"
                  className="w-full px-3.5 py-2.5 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                  data-ocid="login.mobile.input"
                />
              </div>
              <div>
                <span className="block text-sm font-medium text-foreground mb-1.5">
                  Roll Number (Password)
                </span>
                <input
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  placeholder="e.g. AITS/CSE/2024/001"
                  className="w-full px-3.5 py-2.5 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                  data-ocid="login.roll_number.input"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Demo: Mobile <strong>9876543210</strong> • Roll{" "}
                <strong>AITS/CSE/2024/001</strong>
              </p>
              {error && (
                <div
                  className="flex items-center gap-2 text-destructive text-sm bg-destructive/8 rounded-lg px-3 py-2"
                  data-ocid="login.error_state"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}
              <button
                type="button"
                onClick={handleLogin}
                disabled={loading || !mobile || !rollNumber}
                className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                data-ocid="login.student.submit_button"
              >
                {loading ? "Signing in…" : "Sign In as Student"}
              </button>
            </div>
          )}

          {/* Staff Tab */}
          {tab === "staff" && (
            <div className="space-y-4">
              <div>
                <span className="block text-sm font-medium text-foreground mb-1.5">
                  Email Address
                </span>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-3.5 py-2.5 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                  data-ocid="login.email.input"
                />
              </div>
              <div>
                <span className="block text-sm font-medium text-foreground mb-1.5">
                  Password
                </span>
                <div className="relative">
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPwd ? "text" : "password"}
                    placeholder="Enter your password"
                    className="w-full px-3.5 py-2.5 pr-10 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                    data-ocid="login.password.input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPwd ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Demo: <strong>admin@aits.edu</strong> /{" "}
                <strong>admin123</strong>
              </p>
              {error && (
                <div
                  className="flex items-center gap-2 text-destructive text-sm bg-destructive/8 rounded-lg px-3 py-2"
                  data-ocid="login.error_state"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}
              <button
                type="button"
                onClick={handleLogin}
                disabled={loading || !email || !password}
                className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                data-ocid="login.staff.submit_button"
              >
                {loading ? "Signing in…" : "Sign In"}
              </button>
            </div>
          )}

          {/* Student Self-Registration link */}
          {selfRegistrationEnabled && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 pt-5 border-t border-border text-center"
            >
              <p className="text-sm text-muted-foreground mb-2">New student?</p>
              <button
                type="button"
                onClick={onShowRegistration}
                className="flex items-center gap-2 mx-auto px-5 py-2.5 bg-card border border-border rounded-xl text-sm font-medium text-foreground hover:border-primary/50 hover:bg-muted transition-all"
                data-ocid="login.register.button"
              >
                <UserPlus className="w-4 h-4 text-primary" />
                Register as Student →
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
