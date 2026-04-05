import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  GraduationCap,
  Upload,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useRegistration } from "../contexts/RegistrationContext";
import { departments } from "../data/seedData";

const INPUT =
  "w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all";

const LABEL = "block text-xs font-medium text-muted-foreground mb-1.5";

const STEPS = [
  { num: 1, label: "Basic Info" },
  { num: 2, label: "Academic" },
  { num: 3, label: "Personal" },
  { num: 4, label: "Parents" },
  { num: 5, label: "Fee Info" },
  { num: 6, label: "Uploads" },
];

interface FormData {
  name: string;
  rollNumber: string;
  mobile: string;
  gender: "Male" | "Female" | "Other";
  departmentId: string;
  year: string;
  semester: number;
  course: string;
  section: string;
  admissionYear: number;
  dob: string;
  address: string;
  fatherName: string;
  motherName: string;
  parentMobile: string;
  totalFee: number;
  hostelFee: number;
  busFee: number;
  studentPhoto: string;
  idProof: string;
  documents: string;
}

const defaultForm: FormData = {
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
};

function detectCollegeId(): string {
  const hostname = window.location.hostname;
  if (hostname.includes("aits")) return "aits-001";
  if (hostname.includes("gecb")) return "gec-002";
  if (hostname.includes("pcet")) return "pcet-003";
  if (hostname.includes("mec")) return "mec-004";
  return "aits-001";
}

export function StudentRegistrationForm({ onBack }: { onBack: () => void }) {
  const { addRegistration } = useRegistration();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(defaultForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {},
  );
  const [submitted, setSubmitted] = useState(false);

  const set = (field: keyof FormData, value: string | number) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const validate = (s: number): boolean => {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (s === 1) {
      if (!form.name.trim()) e.name = "Full name is required";
      if (!form.rollNumber.trim()) e.rollNumber = "Roll number is required";
      if (!/^[6-9]\d{9}$/.test(form.mobile))
        e.mobile = "Enter valid 10-digit mobile";
    }
    if (s === 2) {
      if (!form.year) e.year = "Year is required";
      if (!form.course) e.course = "Course is required";
      if (!form.section.trim()) e.section = "Section is required";
    }
    if (s === 3) {
      if (!form.dob) e.dob = "Date of birth is required";
      if (!form.address.trim()) e.address = "Address is required";
    }
    if (s === 4) {
      if (!form.fatherName.trim()) e.fatherName = "Father name is required";
      if (!form.motherName.trim()) e.motherName = "Mother name is required";
      if (!/^[6-9]\d{9}$/.test(form.parentMobile))
        e.parentMobile = "Enter valid 10-digit mobile";
    }
    if (s === 5) {
      if (!form.totalFee || form.totalFee <= 0)
        e.totalFee = "Enter valid total fee";
    }
    if (s === 6) {
      if (!form.studentPhoto) e.studentPhoto = "Student photo is required";
      if (!form.idProof) e.idProof = "ID proof is required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (validate(step)) setStep((s) => Math.min(s + 1, 6));
  };

  const prev = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = () => {
    if (!validate(6)) return;
    const dept = departments.find((d) => d.id === form.departmentId);
    const collegeId = detectCollegeId();
    addRegistration({
      ...form,
      department: dept?.name ?? form.departmentId,
      collegeId,
      collegeName: "Aravali Institute of Technical Studies",
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md text-center"
        >
          <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">
            Application Submitted!
          </h2>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Your registration has been submitted successfully. Your application
            is under review. You will be notified once approved by the admin.
          </p>
          <div className="bg-muted rounded-xl p-4 text-left mb-6">
            <p className="text-sm font-medium text-foreground">
              Application Details
            </p>
            <div className="mt-2 space-y-1">
              <p className="text-xs text-muted-foreground">
                Name:{" "}
                <span className="text-foreground font-medium">{form.name}</span>
              </p>
              <p className="text-xs text-muted-foreground">
                Roll No:{" "}
                <span className="text-foreground font-medium">
                  {form.rollNumber}
                </span>
              </p>
              <p className="text-xs text-muted-foreground">
                Status:{" "}
                <span className="text-yellow-600 font-medium">
                  Pending Approval
                </span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="w-full py-2.5 border border-border rounded-xl text-sm font-medium text-foreground hover:bg-muted transition-colors"
            data-ocid="registration.back.button"
          >
            ← Back to Login
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left branding panel */}
      <div
        className="hidden lg:flex w-72 xl:w-80 flex-col justify-between p-10 relative overflow-hidden flex-shrink-0"
        style={{
          background: "linear-gradient(135deg, #0B2A57 0%, #061A3A 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-lg leading-tight">
                EduNest ERP
              </p>
              <p className="text-white/50 text-xs">Student Registration</p>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">
            Join Aravali Institute
          </h2>
          <p className="text-white/60 text-sm leading-relaxed">
            Complete the registration form to apply for admission. Your
            application will be reviewed by the admin team.
          </p>
          <div className="mt-8 space-y-3">
            {STEPS.map((s) => (
              <div
                key={s.num}
                className={`flex items-center gap-3 transition-all ${
                  step === s.num
                    ? "opacity-100"
                    : step > s.num
                      ? "opacity-60"
                      : "opacity-30"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    step > s.num
                      ? "bg-green-500 text-white"
                      : step === s.num
                        ? "bg-primary text-white"
                        : "bg-white/20 text-white"
                  }`}
                >
                  {step > s.num ? "✓" : s.num}
                </div>
                <span
                  className={`text-sm ${step === s.num ? "text-white font-medium" : "text-white/60"}`}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="relative">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors"
            data-ocid="registration.back.link"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Login
          </button>
        </div>
      </div>

      {/* Form area */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-xl">
          {/* Mobile header */}
          <div className="flex items-center gap-3 mb-6 lg:hidden">
            <button
              type="button"
              onClick={onBack}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-primary flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-foreground text-sm">
                Student Registration
              </span>
            </div>
          </div>

          {/* Step indicator (mobile) */}
          <div className="flex items-center gap-1 mb-6 lg:hidden">
            {STEPS.map((s) => (
              <div
                key={s.num}
                className={`h-1.5 flex-1 rounded-full transition-all ${
                  step >= s.num ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>

          <div className="mb-6">
            <h1 className="text-xl font-bold text-foreground">
              Step {step} of 6 — {STEPS[step - 1].label}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Fill in the required information
            </p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
                {/* Step 1: Basic Info */}
                {step === 1 && (
                  <>
                    <div>
                      <span className={LABEL}>Full Name *</span>
                      <input
                        className={INPUT}
                        placeholder="e.g. Rahul Sharma"
                        value={form.name}
                        onChange={(e) => set("name", e.target.value)}
                        data-ocid="registration.name.input"
                      />
                      {errors.name && (
                        <p className="text-xs text-destructive mt-1">
                          {errors.name}
                        </p>
                      )}
                    </div>
                    <div>
                      <span className={LABEL}>Roll Number *</span>
                      <input
                        className={INPUT}
                        placeholder="e.g. AITS/CSE/2024/051"
                        value={form.rollNumber}
                        onChange={(e) => set("rollNumber", e.target.value)}
                        data-ocid="registration.roll_number.input"
                      />
                      {errors.rollNumber && (
                        <p className="text-xs text-destructive mt-1">
                          {errors.rollNumber}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        This will also be your initial login password
                      </p>
                    </div>
                    <div>
                      <span className={LABEL}>Mobile Number *</span>
                      <input
                        className={INPUT}
                        placeholder="10-digit mobile number"
                        value={form.mobile}
                        onChange={(e) => set("mobile", e.target.value)}
                        data-ocid="registration.mobile.input"
                      />
                      {errors.mobile && (
                        <p className="text-xs text-destructive mt-1">
                          {errors.mobile}
                        </p>
                      )}
                    </div>
                    <div>
                      <span className={LABEL}>Gender *</span>
                      <div className="flex gap-4">
                        {(["Male", "Female", "Other"] as const).map((g) => (
                          <label
                            key={g}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <input
                              type="radio"
                              name="gender"
                              value={g}
                              checked={form.gender === g}
                              onChange={() => set("gender", g)}
                              className="accent-primary"
                              data-ocid={`registration.gender_${g.toLowerCase()}.radio`}
                            />
                            <span className="text-sm text-foreground">{g}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Step 2: Academic */}
                {step === 2 && (
                  <>
                    <div>
                      <span className={LABEL}>Department *</span>
                      <select
                        className={INPUT}
                        value={form.departmentId}
                        onChange={(e) => set("departmentId", e.target.value)}
                        data-ocid="registration.department.select"
                      >
                        {departments.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className={LABEL}>Year *</span>
                        <select
                          className={INPUT}
                          value={form.year}
                          onChange={(e) => set("year", e.target.value)}
                          data-ocid="registration.year.select"
                        >
                          {["1st Year", "2nd Year", "3rd Year", "4th Year"].map(
                            (y) => (
                              <option key={y}>{y}</option>
                            ),
                          )}
                        </select>
                        {errors.year && (
                          <p className="text-xs text-destructive mt-1">
                            {errors.year}
                          </p>
                        )}
                      </div>
                      <div>
                        <span className={LABEL}>Semester *</span>
                        <select
                          className={INPUT}
                          value={form.semester}
                          onChange={(e) =>
                            set("semester", Number(e.target.value))
                          }
                          data-ocid="registration.semester.select"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                            <option key={s} value={s}>
                              Semester {s}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className={LABEL}>Course *</span>
                        <select
                          className={INPUT}
                          value={form.course}
                          onChange={(e) => set("course", e.target.value)}
                          data-ocid="registration.course.select"
                        >
                          {["BTech", "Diploma", "BCA", "MCA", "MTech"].map(
                            (c) => (
                              <option key={c}>{c}</option>
                            ),
                          )}
                        </select>
                        {errors.course && (
                          <p className="text-xs text-destructive mt-1">
                            {errors.course}
                          </p>
                        )}
                      </div>
                      <div>
                        <span className={LABEL}>Section *</span>
                        <input
                          className={INPUT}
                          placeholder="e.g. A"
                          value={form.section}
                          onChange={(e) => set("section", e.target.value)}
                          data-ocid="registration.section.input"
                        />
                        {errors.section && (
                          <p className="text-xs text-destructive mt-1">
                            {errors.section}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <span className={LABEL}>Admission Year *</span>
                      <input
                        className={INPUT}
                        type="number"
                        min={2000}
                        max={new Date().getFullYear()}
                        value={form.admissionYear}
                        onChange={(e) =>
                          set("admissionYear", Number(e.target.value))
                        }
                        data-ocid="registration.admission_year.input"
                      />
                    </div>
                  </>
                )}

                {/* Step 3: Personal */}
                {step === 3 && (
                  <>
                    <div>
                      <span className={LABEL}>Date of Birth *</span>
                      <input
                        className={INPUT}
                        type="date"
                        value={form.dob}
                        onChange={(e) => set("dob", e.target.value)}
                        data-ocid="registration.dob.input"
                      />
                      {errors.dob && (
                        <p className="text-xs text-destructive mt-1">
                          {errors.dob}
                        </p>
                      )}
                    </div>
                    <div>
                      <span className={LABEL}>Residential Address *</span>
                      <textarea
                        className={`${INPUT} min-h-[100px] resize-none`}
                        placeholder="Full address with city, state and PIN code"
                        value={form.address}
                        onChange={(e) => set("address", e.target.value)}
                        data-ocid="registration.address.textarea"
                      />
                      {errors.address && (
                        <p className="text-xs text-destructive mt-1">
                          {errors.address}
                        </p>
                      )}
                    </div>
                  </>
                )}

                {/* Step 4: Parent Details */}
                {step === 4 && (
                  <>
                    <div>
                      <span className={LABEL}>Father's Name *</span>
                      <input
                        className={INPUT}
                        placeholder="Father's full name"
                        value={form.fatherName}
                        onChange={(e) => set("fatherName", e.target.value)}
                        data-ocid="registration.father_name.input"
                      />
                      {errors.fatherName && (
                        <p className="text-xs text-destructive mt-1">
                          {errors.fatherName}
                        </p>
                      )}
                    </div>
                    <div>
                      <span className={LABEL}>Mother's Name *</span>
                      <input
                        className={INPUT}
                        placeholder="Mother's full name"
                        value={form.motherName}
                        onChange={(e) => set("motherName", e.target.value)}
                        data-ocid="registration.mother_name.input"
                      />
                      {errors.motherName && (
                        <p className="text-xs text-destructive mt-1">
                          {errors.motherName}
                        </p>
                      )}
                    </div>
                    <div>
                      <span className={LABEL}>Parent/Guardian Mobile *</span>
                      <input
                        className={INPUT}
                        placeholder="10-digit mobile number"
                        value={form.parentMobile}
                        onChange={(e) => set("parentMobile", e.target.value)}
                        data-ocid="registration.parent_mobile.input"
                      />
                      {errors.parentMobile && (
                        <p className="text-xs text-destructive mt-1">
                          {errors.parentMobile}
                        </p>
                      )}
                    </div>
                  </>
                )}

                {/* Step 5: Fee Info */}
                {step === 5 && (
                  <>
                    <div>
                      <span className={LABEL}>Total Tuition Fee (₹) *</span>
                      <input
                        className={INPUT}
                        type="number"
                        placeholder="e.g. 85000"
                        value={form.totalFee || ""}
                        onChange={(e) =>
                          set("totalFee", Number(e.target.value))
                        }
                        data-ocid="registration.total_fee.input"
                      />
                      {errors.totalFee && (
                        <p className="text-xs text-destructive mt-1">
                          {errors.totalFee}
                        </p>
                      )}
                    </div>
                    <div>
                      <span className={LABEL}>
                        Hostel Fee (₹){" "}
                        <span className="text-muted-foreground font-normal">
                          (optional)
                        </span>
                      </span>
                      <input
                        className={INPUT}
                        type="number"
                        placeholder="Leave 0 if not applicable"
                        value={form.hostelFee || ""}
                        onChange={(e) =>
                          set("hostelFee", Number(e.target.value))
                        }
                        data-ocid="registration.hostel_fee.input"
                      />
                    </div>
                    <div>
                      <span className={LABEL}>
                        Bus Fee (₹){" "}
                        <span className="text-muted-foreground font-normal">
                          (optional)
                        </span>
                      </span>
                      <input
                        className={INPUT}
                        type="number"
                        placeholder="Leave 0 if not applicable"
                        value={form.busFee || ""}
                        onChange={(e) => set("busFee", Number(e.target.value))}
                        data-ocid="registration.bus_fee.input"
                      />
                    </div>
                    <div className="bg-muted rounded-xl p-4">
                      <p className="text-sm font-medium text-foreground">
                        Total Amount
                      </p>
                      <p className="text-2xl font-bold text-primary mt-1">
                        ₹
                        {(
                          form.totalFee +
                          form.hostelFee +
                          form.busFee
                        ).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </>
                )}

                {/* Step 6: Uploads */}
                {step === 6 && (
                  <>
                    <FileUploadField
                      label="Student Photo *"
                      hint="JPG/PNG, max 2MB"
                      value={form.studentPhoto}
                      onChange={(v) => set("studentPhoto", v)}
                      error={errors.studentPhoto}
                      ocid="registration.photo.upload_button"
                    />
                    <FileUploadField
                      label="ID Proof (Aadhar / College ID) *"
                      hint="JPG/PNG/PDF, max 5MB"
                      value={form.idProof}
                      onChange={(v) => set("idProof", v)}
                      error={errors.idProof}
                      ocid="registration.id_proof.upload_button"
                    />
                    <FileUploadField
                      label="Additional Documents"
                      hint="Optional — marksheets, certificates, etc."
                      value={form.documents}
                      onChange={(v) => set("documents", v)}
                      ocid="registration.documents.upload_button"
                    />
                    <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted rounded-xl p-3">
                      <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                      <span>
                        Demo mode: files are not actually uploaded. Only file
                        names are stored for preview.
                      </span>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between mt-5">
            <button
              type="button"
              onClick={step === 1 ? onBack : prev}
              className="flex items-center gap-2 px-5 py-2.5 border border-border rounded-xl text-sm font-medium text-foreground hover:bg-muted transition-colors"
              data-ocid="registration.prev.button"
            >
              <ArrowLeft className="w-4 h-4" />
              {step === 1 ? "Cancel" : "Previous"}
            </button>
            {step < 6 ? (
              <button
                type="button"
                onClick={next}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
                data-ocid="registration.next.button"
              >
                Next Step <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors"
                data-ocid="registration.submit_button"
              >
                <CheckCircle className="w-4 h-4" /> Submit Application
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FileUploadField({
  label,
  hint,
  value,
  onChange,
  error,
  ocid,
}: {
  label: string;
  hint: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  ocid: string;
}) {
  return (
    <div>
      <span className={LABEL}>{label}</span>
      <label
        className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-5 cursor-pointer transition-all ${
          value
            ? "border-green-400 bg-green-50 dark:bg-green-900/10"
            : "border-border hover:border-primary/50 bg-background hover:bg-muted/50"
        }`}
        data-ocid={ocid}
      >
        <input
          type="file"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onChange(file.name);
          }}
        />
        {value ? (
          <>
            <CheckCircle className="w-6 h-6 text-green-600" />
            <p className="text-sm font-medium text-green-700 dark:text-green-400">
              {value}
            </p>
            <p className="text-xs text-muted-foreground">Click to change</p>
          </>
        ) : (
          <>
            <Upload className="w-6 h-6 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Click to upload</p>
            <p className="text-xs text-muted-foreground">{hint}</p>
          </>
        )}
      </label>
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}
