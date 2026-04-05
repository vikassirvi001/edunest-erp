import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertCircle,
  CheckCircle,
  Download,
  GraduationCap,
  Search,
  Upload,
  UserPlus,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../../contexts/AuthContext";
import {
  type StudentRegistration,
  useRegistration,
} from "../../contexts/RegistrationContext";
import { departments, students } from "../../data/seedData";

const CARD = "bg-card rounded-2xl border border-border shadow-card p-5";
const INPUT =
  "w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all";
const LABEL = "block text-xs font-medium text-muted-foreground mb-1.5";

function StatusBadge({
  status,
}: { status: StudentRegistration["status"] | "active" }) {
  const map = {
    approved:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    pending:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    active:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  };
  return (
    <Badge className={`border-0 text-xs capitalize ${map[status]}`}>
      {status}
    </Badge>
  );
}

// ─── Tab 1: All Students ─────────────────────────────────────────────────────
function AllStudentsTab() {
  const { registrations } = useRegistration();
  const [search, setSearch] = useState("");

  const seedRows = students.map((s) => ({
    id: s.id,
    name: s.name,
    rollNumber: s.rollNumber,
    department: s.department,
    semester: s.semester,
    status: "approved" as const,
  }));

  const regRows = registrations
    .filter((r) => r.status === "approved")
    .map((r) => ({
      id: r.id,
      name: r.name,
      rollNumber: r.rollNumber,
      department: r.department,
      semester: r.semester,
      status: "approved" as const,
    }));

  const allRows = [...seedRows, ...regRows].filter(
    (r) =>
      !search ||
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.rollNumber.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          className={`${INPUT} pl-10`}
          placeholder="Search by name or roll number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          data-ocid="admin.students.search_input"
        />
      </div>
      <div className={CARD}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" data-ocid="admin.students.table">
            <thead>
              <tr className="border-b border-border">
                {[
                  "#",
                  "Name",
                  "Roll Number",
                  "Department",
                  "Semester",
                  "Status",
                  "Action",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left py-2 pr-4 text-muted-foreground font-medium text-xs"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allRows.slice(0, 60).map((row, i) => (
                <tr
                  key={row.id}
                  className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                  data-ocid={`admin.students.row.${i + 1}`}
                >
                  <td className="py-2.5 pr-4 text-muted-foreground">{i + 1}</td>
                  <td className="py-2.5 pr-4 font-medium text-foreground">
                    {row.name}
                  </td>
                  <td className="py-2.5 pr-4 text-muted-foreground text-xs font-mono">
                    {row.rollNumber}
                  </td>
                  <td className="py-2.5 pr-4 text-muted-foreground">
                    {row.department}
                  </td>
                  <td className="py-2.5 pr-4 text-muted-foreground">
                    Sem {row.semester}
                  </td>
                  <td className="py-2.5 pr-4">
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="py-2.5">
                    <button
                      type="button"
                      className="text-xs px-3 py-1 border border-border rounded-lg hover:bg-muted transition-colors"
                      data-ocid={`admin.students.view.${i + 1}`}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          {allRows.length} students total
        </p>
      </div>
    </div>
  );
}

// ─── Tab 2: Pending Approval ──────────────────────────────────────────────────
function PendingTab() {
  const { registrations, approveStudent, rejectStudent } = useRegistration();
  const pending = registrations.filter((r) => r.status === "pending");

  if (pending.length === 0) {
    return (
      <div
        className={`${CARD} flex flex-col items-center justify-center py-12 text-center`}
        data-ocid="admin.pending.empty_state"
      >
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
          <CheckCircle className="w-6 h-6 text-muted-foreground" />
        </div>
        <p className="font-medium text-foreground">All caught up!</p>
        <p className="text-sm text-muted-foreground mt-1">
          No pending student registrations
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {pending.map((reg, i) => (
        <div
          key={reg.id}
          className={`${CARD} flex flex-col sm:flex-row sm:items-center gap-4`}
          data-ocid={`admin.pending.item.${i + 1}`}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-semibold text-foreground">{reg.name}</p>
              <StatusBadge status={reg.status} />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-0.5">
              <p className="text-xs text-muted-foreground">
                Roll:{" "}
                <span className="text-foreground font-mono">
                  {reg.rollNumber}
                </span>
              </p>
              <p className="text-xs text-muted-foreground">
                Mobile: <span className="text-foreground">{reg.mobile}</span>
              </p>
              <p className="text-xs text-muted-foreground">
                Dept: <span className="text-foreground">{reg.department}</span>
              </p>
              <p className="text-xs text-muted-foreground">
                Course: <span className="text-foreground">{reg.course}</span>
              </p>
              <p className="text-xs text-muted-foreground">
                College:{" "}
                <span className="text-foreground">{reg.collegeName}</span>
              </p>
              <p className="text-xs text-muted-foreground">
                Applied:{" "}
                <span className="text-foreground">
                  {new Date(reg.registeredAt).toLocaleDateString("en-IN")}
                </span>
              </p>
            </div>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => {
                approveStudent(reg.id);
                toast.success(`${reg.name} approved`);
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white rounded-xl text-xs font-semibold hover:bg-green-700 transition-colors"
              data-ocid={`admin.pending.approve.${i + 1}`}
            >
              <CheckCircle className="w-3.5 h-3.5" /> Approve
            </button>
            <button
              type="button"
              onClick={() => {
                rejectStudent(reg.id);
                toast.error(`${reg.name} rejected`);
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-xl text-xs font-semibold hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
              data-ocid={`admin.pending.reject.${i + 1}`}
            >
              <X className="w-3.5 h-3.5" /> Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Tab 3: Add Student ────────────────────────────────────────────────────────
function AddStudentTab() {
  const { addRegistration } = useRegistration();
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: "",
    rollNumber: "",
    mobile: "",
    gender: "Male" as "Male" | "Female" | "Other",
    departmentId: "cse",
    year: "1st Year",
    semester: 1,
    course: "BTech",
    section: "A",
    admissionYear: new Date().getFullYear(),
    dob: "",
    address: "",
    fatherName: "",
    motherName: "",
    parentMobile: "",
    totalFee: 0,
    hostelFee: 0,
    busFee: 0,
    studentPhoto: "",
    idProof: "",
    documents: "",
  });

  const set = (k: keyof typeof form, v: string | number) =>
    setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = () => {
    if (!form.name || !form.rollNumber || !form.mobile) {
      toast.error("Name, roll number and mobile are required");
      return;
    }
    const dept = departments.find((d) => d.id === form.departmentId);
    addRegistration(
      {
        ...form,
        department: dept?.name ?? form.departmentId,
        collegeId: user?.collegeId ?? "aits-001",
        collegeName: "Aravali Institute of Technical Studies",
      },
      "approved",
    );
    setSaved(true);
    toast.success(`${form.name} added as active student`);
    setForm({
      name: "",
      rollNumber: "",
      mobile: "",
      gender: "Male",
      departmentId: "cse",
      year: "1st Year",
      semester: 1,
      course: "BTech",
      section: "A",
      admissionYear: new Date().getFullYear(),
      dob: "",
      address: "",
      fatherName: "",
      motherName: "",
      parentMobile: "",
      totalFee: 0,
      hostelFee: 0,
      busFee: 0,
      studentPhoto: "",
      idProof: "",
      documents: "",
    });
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className={CARD}>
      <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-xl">
        <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
        <span className="text-sm text-blue-700 dark:text-blue-400">
          Admin-added students are set to <strong>Active</strong> immediately.
          Initial password = roll number (bcrypt hashed).
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <span className={LABEL}>Full Name *</span>
          <input
            className={INPUT}
            placeholder="Full name"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            data-ocid="admin.add_student.name.input"
          />
        </div>
        <div>
          <span className={LABEL}>Roll Number *</span>
          <input
            className={INPUT}
            placeholder="AITS/CSE/2024/001"
            value={form.rollNumber}
            onChange={(e) => set("rollNumber", e.target.value)}
            data-ocid="admin.add_student.roll_number.input"
          />
        </div>
        <div>
          <span className={LABEL}>Mobile *</span>
          <input
            className={INPUT}
            placeholder="10-digit mobile"
            value={form.mobile}
            onChange={(e) => set("mobile", e.target.value)}
            data-ocid="admin.add_student.mobile.input"
          />
        </div>
        <div>
          <span className={LABEL}>Gender</span>
          <select
            className={INPUT}
            value={form.gender}
            onChange={(e) =>
              set("gender", e.target.value as "Male" | "Female" | "Other")
            }
            data-ocid="admin.add_student.gender.select"
          >
            {["Male", "Female", "Other"].map((g) => (
              <option key={g}>{g}</option>
            ))}
          </select>
        </div>
        <div>
          <span className={LABEL}>Department</span>
          <select
            className={INPUT}
            value={form.departmentId}
            onChange={(e) => set("departmentId", e.target.value)}
            data-ocid="admin.add_student.department.select"
          >
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <span className={LABEL}>Course</span>
          <select
            className={INPUT}
            value={form.course}
            onChange={(e) => set("course", e.target.value)}
            data-ocid="admin.add_student.course.select"
          >
            {["BTech", "Diploma", "BCA", "MCA", "MTech"].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <span className={LABEL}>Year</span>
          <select
            className={INPUT}
            value={form.year}
            onChange={(e) => set("year", e.target.value)}
            data-ocid="admin.add_student.year.select"
          >
            {["1st Year", "2nd Year", "3rd Year", "4th Year"].map((y) => (
              <option key={y}>{y}</option>
            ))}
          </select>
        </div>
        <div>
          <span className={LABEL}>Semester</span>
          <select
            className={INPUT}
            value={form.semester}
            onChange={(e) => set("semester", Number(e.target.value))}
            data-ocid="admin.add_student.semester.select"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
              <option key={s} value={s}>
                Sem {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <span className={LABEL}>Section</span>
          <input
            className={INPUT}
            placeholder="A"
            value={form.section}
            onChange={(e) => set("section", e.target.value)}
            data-ocid="admin.add_student.section.input"
          />
        </div>
        <div>
          <span className={LABEL}>Admission Year</span>
          <input
            className={INPUT}
            type="number"
            value={form.admissionYear}
            onChange={(e) => set("admissionYear", Number(e.target.value))}
            data-ocid="admin.add_student.admission_year.input"
          />
        </div>
        <div>
          <span className={LABEL}>Date of Birth</span>
          <input
            className={INPUT}
            type="date"
            value={form.dob}
            onChange={(e) => set("dob", e.target.value)}
            data-ocid="admin.add_student.dob.input"
          />
        </div>
        <div>
          <span className={LABEL}>Father Name</span>
          <input
            className={INPUT}
            placeholder="Father's full name"
            value={form.fatherName}
            onChange={(e) => set("fatherName", e.target.value)}
            data-ocid="admin.add_student.father_name.input"
          />
        </div>
        <div>
          <span className={LABEL}>Mother Name</span>
          <input
            className={INPUT}
            placeholder="Mother's full name"
            value={form.motherName}
            onChange={(e) => set("motherName", e.target.value)}
            data-ocid="admin.add_student.mother_name.input"
          />
        </div>
        <div>
          <span className={LABEL}>Parent Mobile</span>
          <input
            className={INPUT}
            placeholder="10-digit mobile"
            value={form.parentMobile}
            onChange={(e) => set("parentMobile", e.target.value)}
            data-ocid="admin.add_student.parent_mobile.input"
          />
        </div>
        <div className="sm:col-span-2">
          <span className={LABEL}>Address</span>
          <textarea
            className={`${INPUT} min-h-[72px] resize-none`}
            placeholder="Full address"
            value={form.address}
            onChange={(e) => set("address", e.target.value)}
            data-ocid="admin.add_student.address.textarea"
          />
        </div>
        <div>
          <span className={LABEL}>Total Fee (₹)</span>
          <input
            className={INPUT}
            type="number"
            value={form.totalFee || ""}
            onChange={(e) => set("totalFee", Number(e.target.value))}
            data-ocid="admin.add_student.total_fee.input"
          />
        </div>
        <div>
          <span className={LABEL}>Hostel Fee (₹)</span>
          <input
            className={INPUT}
            type="number"
            value={form.hostelFee || ""}
            onChange={(e) => set("hostelFee", Number(e.target.value))}
            data-ocid="admin.add_student.hostel_fee.input"
          />
        </div>
        <div>
          <span className={LABEL}>Bus Fee (₹)</span>
          <input
            className={INPUT}
            type="number"
            value={form.busFee || ""}
            onChange={(e) => set("busFee", Number(e.target.value))}
            data-ocid="admin.add_student.bus_fee.input"
          />
        </div>
        <div>
          <span className={LABEL}>College ID</span>
          <input
            className={`${INPUT} bg-muted cursor-not-allowed`}
            value={user?.collegeId ?? "aits-001"}
            readOnly
          />
          <p className="text-xs text-muted-foreground mt-1">
            Auto-linked to your college
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        className="mt-5 flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
        data-ocid="admin.add_student.submit_button"
      >
        {saved ? (
          <>
            <CheckCircle className="w-4 h-4" /> Student Added!
          </>
        ) : (
          <>
            <UserPlus className="w-4 h-4" /> Add Student
          </>
        )}
      </button>
    </div>
  );
}

// ─── CSV Row Type ─────────────────────────────────────────────────────────────
interface CsvRow {
  rowNum: number;
  name: string;
  rollNumber: string;
  mobile: string;
  department: string;
  year: string;
  course: string;
  gender: string;
  fatherName: string;
  address: string;
  dob: string;
  errors: string[];
}

// ─── Tab 4: Bulk CSV ──────────────────────────────────────────────────────────
function BulkCsvTab() {
  const { addRegistration } = useRegistration();
  const { user } = useAuth();
  const [rows, setRows] = useState<CsvRow[]>([]);
  const [dragging, setDragging] = useState(false);
  const [imported, setImported] = useState(false);

  const SAMPLE_CSV =
    "name,rollNumber,mobile,department,year,course,gender,fatherName,address,dob\n" +
    'Aarav Singh,AITS/CSE/2024/060,9876501234,Computer Science & Engineering,1st Year,BTech,Male,Vijay Singh,"12 MG Road, Udaipur",2006-05-10\n' +
    'Meera Sharma,AITS/AIML/2024/061,9876501235,Artificial Intelligence & Machine Learning,1st Year,BTech,Female,Rakesh Sharma,"34 Fateh Sagar, Udaipur",2006-08-20';

  const downloadSample = () => {
    const blob = new Blob([SAMPLE_CSV], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sample_students.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const parseCsv = (text: string) => {
    const lines = text.split("\n").filter((l) => l.trim());
    if (lines.length < 2) return;
    const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""));
    const parsed: CsvRow[] = [];
    const mobilesSeen = new Set<string>();

    for (let i = 1; i < lines.length; i++) {
      // Simple CSV parse — handle quoted fields
      const cols: string[] = [];
      let cur = "";
      let inQuote = false;
      for (const ch of lines[i]) {
        if (ch === '"') {
          inQuote = !inQuote;
        } else if (ch === "," && !inQuote) {
          cols.push(cur.trim());
          cur = "";
        } else {
          cur += ch;
        }
      }
      cols.push(cur.trim());

      const get = (key: string) => cols[headers.indexOf(key)] ?? "";
      const name = get("name");
      const rollNumber = get("rollNumber");
      const mobile = get("mobile");
      const department = get("department");
      const year = get("year");
      const course = get("course");
      const gender = get("gender");
      const fatherName = get("fatherName");
      const address = get("address");
      const dob = get("dob");

      const errors: string[] = [];
      if (!name) errors.push("Missing name");
      if (!mobile) errors.push("Missing mobile");
      else if (!/^[6-9]\d{9}$/.test(mobile))
        errors.push("Invalid mobile format");
      else if (mobilesSeen.has(mobile)) errors.push("Duplicate mobile in CSV");
      if (!rollNumber) errors.push("Missing roll number");

      if (mobile && /^[6-9]\d{9}$/.test(mobile)) mobilesSeen.add(mobile);

      parsed.push({
        rowNum: i,
        name,
        rollNumber,
        mobile,
        department,
        year,
        course,
        gender,
        fatherName,
        address,
        dob,
        errors,
      });
    }
    setRows(parsed);
    setImported(false);
  };

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => parseCsv((e.target?.result as string) ?? "");
    reader.readAsText(file);
  };

  const validRows = rows.filter((r) => r.errors.length === 0);
  const errorRows = rows.filter((r) => r.errors.length > 0);

  const importValid = () => {
    for (const row of validRows) {
      addRegistration(
        {
          name: row.name,
          rollNumber: row.rollNumber,
          mobile: row.mobile,
          gender: (row.gender as "Male" | "Female" | "Other") || "Male",
          department: row.department,
          departmentId: "cse",
          year: row.year || "1st Year",
          semester: 1,
          course: row.course || "BTech",
          section: "A",
          admissionYear: new Date().getFullYear(),
          address: row.address,
          dob: row.dob,
          fatherName: row.fatherName,
          motherName: "",
          parentMobile: "",
          totalFee: 0,
          hostelFee: 0,
          busFee: 0,
          studentPhoto: "",
          idProof: "",
          documents: "",
          collegeId: user?.collegeId ?? "aits-001",
          collegeName: "Aravali Institute of Technical Studies",
        },
        "approved",
      );
    }
    toast.success(`${validRows.length} students imported successfully!`);
    setImported(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Bulk CSV Import</h3>
        <button
          type="button"
          onClick={downloadSample}
          className="flex items-center gap-2 px-4 py-2 border border-border rounded-xl text-xs font-medium text-foreground hover:bg-muted transition-colors"
          data-ocid="admin.csv.download_button"
        >
          <Download className="w-3.5 h-3.5" /> Download Sample CSV
        </button>
      </div>

      {/* Drop zone */}
      <label
        className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-2xl p-10 cursor-pointer transition-all ${
          dragging
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50 hover:bg-muted/50"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const f = e.dataTransfer.files[0];
          if (f) handleFile(f);
        }}
        data-ocid="admin.csv.dropzone"
      >
        <input
          type="file"
          accept=".csv"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />
        <Upload className="w-8 h-8 text-muted-foreground" />
        <div className="text-center">
          <p className="font-medium text-foreground text-sm">
            Drag & drop CSV file here
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            or click to browse — only .csv files
          </p>
        </div>
      </label>

      {rows.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex gap-3">
              <span className="text-sm font-medium text-green-600">
                {validRows.length} valid
              </span>
              {errorRows.length > 0 && (
                <span className="text-sm font-medium text-red-600">
                  {errorRows.length} errors
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setRows([]);
                  setImported(false);
                }}
                className="px-3 py-1.5 border border-border rounded-lg text-xs hover:bg-muted transition-colors"
                data-ocid="admin.csv.clear.button"
              >
                Clear
              </button>
              {!imported && validRows.length > 0 && (
                <button
                  type="button"
                  onClick={importValid}
                  className="flex items-center gap-1.5 px-4 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:bg-primary/90 transition-colors"
                  data-ocid="admin.csv.import.button"
                >
                  <CheckCircle className="w-3.5 h-3.5" /> Import{" "}
                  {validRows.length} Valid Rows
                </button>
              )}
              {imported && (
                <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                  <CheckCircle className="w-3.5 h-3.5" /> Imported!
                </span>
              )}
            </div>
          </div>

          <div className={CARD}>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border">
                    {[
                      "#",
                      "Name",
                      "Roll No",
                      "Mobile",
                      "Department",
                      "Course",
                      "Validation",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left py-2 pr-3 text-muted-foreground font-medium"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr
                      key={row.rowNum}
                      className={`border-b border-border last:border-0 ${
                        row.errors.length > 0
                          ? "bg-red-50 dark:bg-red-900/10"
                          : ""
                      }`}
                    >
                      <td className="py-2 pr-3 text-muted-foreground">
                        {row.rowNum}
                      </td>
                      <td className="py-2 pr-3 font-medium text-foreground">
                        {row.name || <span className="text-red-500">—</span>}
                      </td>
                      <td className="py-2 pr-3 font-mono text-muted-foreground">
                        {row.rollNumber || "—"}
                      </td>
                      <td className="py-2 pr-3 text-muted-foreground">
                        {row.mobile || "—"}
                      </td>
                      <td className="py-2 pr-3 text-muted-foreground">
                        {row.department || "—"}
                      </td>
                      <td className="py-2 pr-3 text-muted-foreground">
                        {row.course || "—"}
                      </td>
                      <td className="py-2 pr-3">
                        {row.errors.length === 0 ? (
                          <span className="text-green-600 font-medium">
                            ✓ Valid
                          </span>
                        ) : (
                          <span className="text-red-600">
                            {row.errors.join("; ")}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function AdminStudents() {
  const { registrations } = useRegistration();
  const pendingCount = registrations.filter(
    (r) => r.status === "pending",
  ).length;

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
          <GraduationCap className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">
            Student Management
          </h2>
          <p className="text-xs text-muted-foreground">
            Manage registrations, approvals, and bulk imports
          </p>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList
          className="w-full sm:w-auto mb-5"
          data-ocid="admin.students.tab"
        >
          <TabsTrigger value="all" data-ocid="admin.students.all.tab">
            All Students
          </TabsTrigger>
          <TabsTrigger value="pending" data-ocid="admin.students.pending.tab">
            Pending Approval
            {pendingCount > 0 && (
              <span className="ml-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-yellow-500 text-white text-xs font-bold inline-flex items-center justify-center">
                {pendingCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="add" data-ocid="admin.students.add.tab">
            Add Student
          </TabsTrigger>
          <TabsTrigger value="csv" data-ocid="admin.students.csv.tab">
            Bulk CSV
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <AllStudentsTab />
        </TabsContent>
        <TabsContent value="pending">
          <PendingTab />
        </TabsContent>
        <TabsContent value="add">
          <AddStudentTab />
        </TabsContent>
        <TabsContent value="csv">
          <BulkCsvTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
