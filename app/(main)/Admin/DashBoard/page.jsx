"use client";
import { useAuthStore } from "@/Store/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import StatCard from "@/Components/Cards/StatsCard";
export default function AdminDashBoard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);
  const fetchData = async () => {
    try {
      const res = await fetch(`/api/DashBoard?id=${user?.id}&role=Admin`);
      if (res.status == 200) {
        const data = await res.json();
        setData(data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error", error);
    }
  };
  if (loading) return <div>Loading</div>;
  return (
    <div>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            👨‍💼 Admin Dashboard
          </h1>
        </header>

        {/* 2x2 Ultra-Fast Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
          {/* USERS CARD */}
          <StatCard
            icon="👥"
            title="Users"
            total={data.totalUsers}
            active={data.activeUsers}
            color="from-blue-500 to-blue-600"
          />

          {/* JOBS CARD */}
          <StatCard
            icon="💼"
            title="Jobs"
            total={data.totalJobs}
            active={data.activeJobs}
            color="from-emerald-500 to-emerald-600"
          />

          {/* EMPLOYERS CARD */}
          <StatCard
            icon="👔"
            title="Employers"
            total={data.totalEmployer}
            active={null}
            color="from-purple-500 to-purple-600"
          />

          {/* APPLICANTS CARD */}
          <StatCard
            icon="👷"
            title="Applicants"
            total={data.totalApplicant}
            active={null}
            color="from-orange-500 to-orange-600"
          />
        </div>
      </div>
    </div>
  );
}
