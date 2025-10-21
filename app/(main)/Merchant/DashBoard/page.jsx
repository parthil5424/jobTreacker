"use client";
import ApplicantDashBoard from "@/Components/DashBoard/ApplicantDashBoard";
import EmployerDashBoard from "@/Components/DashBoard/EmployerDashBoard";
import { useAuthStore } from "@/Store/useAuthStore";

function MerchantDashBoard() {
  const { logout, user } = useAuthStore();
  if (user?.role?.name == "Applicant") return <ApplicantDashBoard />;
  if (user?.role?.name == "Employer") return <EmployerDashBoard />;
}

export default MerchantDashBoard;
