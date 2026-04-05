import { createContext, useContext, useState } from "react";

export interface StudentRegistration {
  id: string;
  name: string;
  rollNumber: string;
  mobile: string;
  gender: "Male" | "Female" | "Other";
  department: string;
  departmentId: string;
  year: string;
  semester: number;
  course: string;
  section: string;
  admissionYear: number;
  address: string;
  dob: string;
  fatherName: string;
  motherName: string;
  parentMobile: string;
  totalFee: number;
  hostelFee: number;
  busFee: number;
  studentPhoto: string;
  idProof: string;
  documents: string;
  collegeId: string;
  collegeName: string;
  status: "pending" | "approved" | "rejected";
  registeredAt: string;
  passwordHash: string;
}

const pendingStudentsDemo: StudentRegistration[] = [
  {
    id: "reg-001",
    name: "Aakash Sharma",
    rollNumber: "AITS/CSE/2024/051",
    mobile: "9876512345",
    gender: "Male",
    department: "Computer Science & Engineering",
    departmentId: "cse",
    year: "1st Year",
    semester: 1,
    course: "BTech",
    section: "A",
    admissionYear: 2024,
    address: "12, Sector 4, Hiran Magri, Udaipur, Rajasthan 313001",
    dob: "2006-08-15",
    fatherName: "Ramesh Sharma",
    motherName: "Sunita Sharma",
    parentMobile: "9876543200",
    totalFee: 85000,
    hostelFee: 45000,
    busFee: 0,
    studentPhoto: "aakash_photo.jpg",
    idProof: "aakash_aadhar.pdf",
    documents: "",
    collegeId: "aits-001",
    collegeName: "Aravali Institute of Technical Studies",
    status: "pending",
    registeredAt: "2024-03-28T10:30:00Z",
    passwordHash: "$2b$10$[simulated_hash_of_AITS/CSE/2024/051]",
  },
  {
    id: "reg-002",
    name: "Priyanka Meena",
    rollNumber: "AITS/AIML/2024/052",
    mobile: "9988776655",
    gender: "Female",
    department: "Artificial Intelligence & Machine Learning",
    departmentId: "aiml",
    year: "1st Year",
    semester: 1,
    course: "BTech",
    section: "B",
    admissionYear: 2024,
    address: "45, Gandhi Nagar, Near Clock Tower, Udaipur, Rajasthan 313001",
    dob: "2006-03-22",
    fatherName: "Suresh Meena",
    motherName: "Kamla Meena",
    parentMobile: "9988776600",
    totalFee: 95000,
    hostelFee: 45000,
    busFee: 12000,
    studentPhoto: "priyanka_photo.jpg",
    idProof: "priyanka_aadhar.pdf",
    documents: "priyanka_marksheet.pdf",
    collegeId: "aits-001",
    collegeName: "Aravali Institute of Technical Studies",
    status: "pending",
    registeredAt: "2024-03-29T14:15:00Z",
    passwordHash: "$2b$10$[simulated_hash_of_AITS/AIML/2024/052]",
  },
  {
    id: "reg-003",
    name: "Harshit Patel",
    rollNumber: "AITS/MECH/2024/053",
    mobile: "9123456789",
    gender: "Male",
    department: "Mechanical Engineering",
    departmentId: "mech",
    year: "1st Year",
    semester: 1,
    course: "BTech",
    section: "A",
    admissionYear: 2024,
    address: "78, Udaipole, Bedla Road, Udaipur, Rajasthan 313002",
    dob: "2005-11-05",
    fatherName: "Dinesh Patel",
    motherName: "Rekha Patel",
    parentMobile: "9123456700",
    totalFee: 81000,
    hostelFee: 0,
    busFee: 12000,
    studentPhoto: "harshit_photo.jpg",
    idProof: "harshit_collegeid.pdf",
    documents: "",
    collegeId: "aits-001",
    collegeName: "Aravali Institute of Technical Studies",
    status: "pending",
    registeredAt: "2024-03-30T09:00:00Z",
    passwordHash: "$2b$10$[simulated_hash_of_AITS/MECH/2024/053]",
  },
];

interface RegistrationContextType {
  selfRegistrationEnabled: boolean;
  registrations: StudentRegistration[];
  toggleSelfRegistration: () => void;
  addRegistration: (
    r: Omit<
      StudentRegistration,
      "id" | "status" | "registeredAt" | "passwordHash"
    >,
    status?: "pending" | "approved",
  ) => void;
  approveStudent: (id: string) => void;
  rejectStudent: (id: string) => void;
}

const RegistrationContext = createContext<RegistrationContextType | null>(null);

export function RegistrationProvider({
  children,
}: { children: React.ReactNode }) {
  const [selfRegistrationEnabled, setSelfRegistrationEnabled] = useState(false);
  const [registrations, setRegistrations] =
    useState<StudentRegistration[]>(pendingStudentsDemo);

  const toggleSelfRegistration = () => setSelfRegistrationEnabled((v) => !v);

  const addRegistration = (
    r: Omit<
      StudentRegistration,
      "id" | "status" | "registeredAt" | "passwordHash"
    >,
    status: "pending" | "approved" = "pending",
  ) => {
    const newReg: StudentRegistration = {
      ...r,
      id: `reg-${Date.now()}`,
      status,
      registeredAt: new Date().toISOString(),
      passwordHash: `$2b$10$[simulated_hash_of_${r.rollNumber}]`,
    };
    setRegistrations((prev) => [newReg, ...prev]);
  };

  const approveStudent = (id: string) => {
    setRegistrations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "approved" } : r)),
    );
  };

  const rejectStudent = (id: string) => {
    setRegistrations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "rejected" } : r)),
    );
  };

  return (
    <RegistrationContext.Provider
      value={{
        selfRegistrationEnabled,
        registrations,
        toggleSelfRegistration,
        addRegistration,
        approveStudent,
        rejectStudent,
      }}
    >
      {children}
    </RegistrationContext.Provider>
  );
}

export function useRegistration() {
  const ctx = useContext(RegistrationContext);
  if (!ctx)
    throw new Error("useRegistration must be used within RegistrationProvider");
  return ctx;
}
