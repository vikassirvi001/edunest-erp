import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  type College,
  type User,
  colleges,
  students,
  teachers,
  users,
} from "../data/seedData";

interface AuthUser extends User {
  college: College;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => {
    success: boolean;
    error?: string;
  };
  loginAsDemo: (role: User["role"]) => void;
  logout: () => void;
}

interface LoginCredentials {
  mobile?: string;
  rollNumber?: string;
  email?: string;
  password: string;
  loginType: "student" | "staff";
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem("erp_user");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("erp_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("erp_user");
    }
  }, [user]);

  const resolveCollege = (collegeId: string): College => {
    if (collegeId === "system") {
      return {
        id: "system",
        name: "EduNest Platform",
        shortName: "EN",
        location: "Cloud",
        logo: null,
        themeColor: "#2F80ED",
        established: 2020,
        contactEmail: "support@edunest.com",
        phone: "",
        website: "www.edunest.com",
        plan: "Enterprise",
        status: "active",
        studentCount: 0,
        teacherCount: 0,
        monthlyRevenue: 0,
        subdomain: "platform",
      };
    }
    return colleges.find((c) => c.id === collegeId) ?? colleges[0];
  };

  const buildAuthUser = (u: User): AuthUser => ({
    ...u,
    college: resolveCollege(u.collegeId),
  });

  const login = (
    credentials: LoginCredentials,
  ): { success: boolean; error?: string } => {
    if (credentials.loginType === "student") {
      const student = students.find(
        (s) =>
          s.mobile === credentials.mobile &&
          s.rollNumber === credentials.rollNumber,
      );
      if (!student)
        return {
          success: false,
          error: "Invalid mobile number or roll number",
        };
      const u = users.find((u) => u.id === student.id);
      if (!u) return { success: false, error: "User account not found" };
      setUser(buildAuthUser(u));
      return { success: true };
    }
    const u = users.find(
      (u) =>
        u.email === credentials.email &&
        u.password === credentials.password &&
        u.role !== "student",
    );
    if (!u) return { success: false, error: "Invalid email or password" };
    setUser(buildAuthUser(u));
    return { success: true };
  };

  const loginAsDemo = (role: User["role"]) => {
    const u = users.find((u) => u.role === role);
    if (u) setUser(buildAuthUser(u));
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, login, loginAsDemo, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
