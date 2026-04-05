import {
  AlertCircle,
  Bell,
  BookOpen,
  Calendar,
  CheckCircle,
  ClipboardList,
  Upload,
  UserCheck,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  assignments,
  examSchedules,
  students,
  teachers,
} from "../../data/seedData";

const CARD = "bg-card rounded-2xl border border-border shadow-card p-5";

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

export function TeacherDashboard({ section }: { section: string }) {
  const { user } = useAuth();
  const teacher = teachers.find((t) => t.id === user?.id) ?? teachers[0];
  const deptStudents = students.filter(
    (s) => s.departmentId === teacher.departmentId,
  );
  const teacherAssignments = assignments.filter(
    (a) => a.teacherId === teacher.id,
  );
  const deptExams = examSchedules.filter(
    (e) => e.department === teacher.department,
  );

  const [attendanceStudents, setAttendanceStudents] = useState(
    deptStudents
      .slice(0, 10)

      .reduce<Record<string, boolean>>((acc, s) => {
        acc[s.id] = true;
        return acc;
      }, {}),
  );
  const [attendanceSaved, setAttendanceSaved] = useState(false);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteSubject, setNoteSubject] = useState("");
  const [assignTitle, setAssignTitle] = useState("");
  const [assignSubject, setAssignSubject] = useState("");
  const [assignDue, setAssignDue] = useState("");
  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeContent, setNoticeContent] = useState("");
  const [saved, setSaved] = useState<string | null>(null);

  const showSaved = (key: string) => {
    setSaved(key);
    setTimeout(() => setSaved(null), 2500);
  };

  const INPUT =
    "w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all";

  if (section === "attendance") {
    return (
      <div className="p-6 max-w-3xl mx-auto space-y-6">
        <h2 className="text-xl font-bold text-foreground">Mark Attendance</h2>
        <div className={CARD}>
          <div className="flex flex-wrap gap-4 mb-5">
            <select className={`${INPUT} max-w-xs`}>
              <option>{teacher.department}</option>
            </select>
            <select className={`${INPUT} max-w-xs`}>
              {[5, 3, 7, 1].map((s) => (
                <option key={s}>Semester {s}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            {deptStudents.slice(0, 10).map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-muted/50 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {s.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {s.rollNumber}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setAttendanceStudents((p) => ({ ...p, [s.id]: true }))
                    }
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      attendanceStudents[s.id]
                        ? "bg-green-500 text-white"
                        : "bg-muted text-muted-foreground hover:bg-green-100"
                    }`}
                  >
                    Present
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setAttendanceStudents((p) => ({ ...p, [s.id]: false }))
                    }
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      !attendanceStudents[s.id]
                        ? "bg-red-500 text-white"
                        : "bg-muted text-muted-foreground hover:bg-red-100"
                    }`}
                  >
                    Absent
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              setAttendanceSaved(true);
              showSaved("attendance");
            }}
            className="mt-5 w-full py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors"
            data-ocid="teacher.attendance.submit_button"
          >
            {attendanceSaved && saved === "attendance" ? (
              <span className="flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4" /> Attendance Saved!
              </span>
            ) : (
              "Submit Attendance"
            )}
          </button>
        </div>
      </div>
    );
  }

  if (section === "notes") {
    return (
      <div className="p-6 max-w-2xl mx-auto space-y-6">
        <h2 className="text-xl font-bold text-foreground">Upload Notes</h2>
        <div className={CARD}>
          <div className="flex items-center gap-2 mb-5 px-3 py-2 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-xl">
            <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0" />
            <span className="text-sm text-yellow-700 dark:text-yellow-400 font-medium">
              Demo Mode
            </span>
            <span className="text-xs text-yellow-600">
              File uploads are simulated in demo
            </span>
          </div>
          <div className="space-y-4">
            <div>
              <span className="block text-sm font-medium text-foreground mb-1.5">
                Subject
              </span>
              <select
                className={INPUT}
                value={noteSubject}
                onChange={(e) => setNoteSubject(e.target.value)}
              >
                <option value="">Select subject</option>
                {teacher.subjects.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <span className="block text-sm font-medium text-foreground mb-1.5">
                Note Title
              </span>
              <input
                className={INPUT}
                placeholder="e.g. Unit 3 - Trees and Graphs"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
              />
            </div>
            <div>
              <span className="block text-sm font-medium text-foreground mb-1.5">
                File
              </span>
              <div
                className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/40 transition-colors cursor-pointer"
                data-ocid="teacher.notes.dropzone"
              >
                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Click to upload or drag & drop
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PDF, DOC, PPT up to 50MB
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => showSaved("notes")}
              className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors"
              data-ocid="teacher.notes.submit_button"
            >
              {saved === "notes" ? "Uploaded! (Demo)" : "Upload Note"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (section === "assignments") {
    return (
      <div className="p-6 max-w-3xl mx-auto space-y-6">
        <h2 className="text-xl font-bold text-foreground">Assignments</h2>
        <div className={CARD}>
          <h3 className="font-semibold text-foreground mb-4">
            Create Assignment
          </h3>
          <div className="space-y-4">
            <input
              className={INPUT}
              placeholder="Assignment Title"
              value={assignTitle}
              onChange={(e) => setAssignTitle(e.target.value)}
              data-ocid="teacher.assignment.input"
            />
            <select
              className={INPUT}
              value={assignSubject}
              onChange={(e) => setAssignSubject(e.target.value)}
            >
              <option value="">Select Subject</option>
              {teacher.subjects.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <input
              className={INPUT}
              type="date"
              value={assignDue}
              onChange={(e) => setAssignDue(e.target.value)}
            />
            <textarea
              className={`${INPUT} min-h-[90px] resize-y`}
              placeholder="Assignment description..."
            />
            <button
              type="button"
              onClick={() => showSaved("assign")}
              className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors"
              data-ocid="teacher.assignment.submit_button"
            >
              {saved === "assign" ? "Assignment Created!" : "Create Assignment"}
            </button>
          </div>
        </div>
        <div className={CARD}>
          <h3 className="font-semibold text-foreground mb-4">My Assignments</h3>
          <div className="space-y-3">
            {teacherAssignments.map((a) => (
              <div
                key={a.id}
                className="flex items-start justify-between gap-4 py-2.5 border-b border-border last:border-0"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {a.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {a.subject} • Due: {a.dueDate}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-semibold text-foreground">
                    {a.totalSubmitted}/{a.totalStudents}
                  </p>
                  <p className="text-xs text-muted-foreground">submitted</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (section === "notices") {
    return (
      <div className="p-6 max-w-2xl mx-auto space-y-6">
        <h2 className="text-xl font-bold text-foreground">Post Notice</h2>
        <div className={CARD}>
          <div className="space-y-4">
            <input
              className={INPUT}
              placeholder="Notice Title"
              value={noticeTitle}
              onChange={(e) => setNoticeTitle(e.target.value)}
              data-ocid="teacher.notice.input"
            />
            <textarea
              className={`${INPUT} min-h-[120px] resize-y`}
              placeholder="Notice content..."
              value={noticeContent}
              onChange={(e) => setNoticeContent(e.target.value)}
            />
            <div>
              <span className="block text-sm font-medium text-foreground mb-2">
                Target
              </span>
              <div className="flex flex-wrap gap-2">
                {["Students", "Teachers", "All"].map((t) => (
                  <label
                    key={t}
                    className="flex items-center gap-2 px-3 py-1.5 border border-border rounded-lg text-sm text-foreground cursor-pointer hover:bg-muted"
                  >
                    <input
                      type="checkbox"
                      defaultChecked={t === "Students"}
                      className="accent-primary"
                    />
                    {t}
                  </label>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={() => showSaved("notice")}
              className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors"
              data-ocid="teacher.notice.submit_button"
            >
              {saved === "notice" ? "Notice Posted!" : "Post Notice"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (section === "exams") {
    return (
      <div className="p-6 max-w-3xl mx-auto space-y-6">
        <h2 className="text-xl font-bold text-foreground">Exam Schedule</h2>
        <div className={CARD}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["Subject", "Date", "Time", "Duration", "Room"].map((h) => (
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
                {deptExams.map((e) => (
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

  // Dashboard
  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-xl font-bold text-foreground">
          Good Morning, {teacher.name.split(" ").slice(-2).join(" ")}
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          {teacher.designation} • {teacher.department} •{" "}
          {user?.college?.name ?? "AITS"}
        </p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          value={String(deptStudents.length)}
          label="My Students"
          color="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
        />
        <StatCard
          icon={BookOpen}
          value={String(teacher.subjects.length)}
          label="My Subjects"
          color="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
        />
        <StatCard
          icon={ClipboardList}
          value={String(
            teacherAssignments.filter((a) => a.totalSubmitted < a.totalStudents)
              .length,
          )}
          label="Pending Reviews"
          color="bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400"
        />
        <StatCard
          icon={UserCheck}
          value={String(deptStudents.slice(0, 10).length)}
          label="Marked Today"
          color="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={CARD}>
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-primary" /> Recent
            Assignments
          </h3>
          <div className="space-y-3">
            {teacherAssignments.map((a) => (
              <div
                key={a.id}
                className="flex items-start justify-between gap-4 py-2 border-b border-border last:border-0"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {a.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {a.subject} • Due: {a.dueDate}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-xs font-semibold text-foreground">
                    {a.totalSubmitted}/{a.totalStudents}
                  </span>
                  <p className="text-xs text-muted-foreground">submitted</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={CARD}>
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" /> Upcoming Exams
          </h3>
          <div className="space-y-2">
            {deptExams.slice(0, 4).map((e) => (
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
      </div>
    </div>
  );
}
