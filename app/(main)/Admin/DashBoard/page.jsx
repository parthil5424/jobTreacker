"use client";
import { useAuthStore } from "@/Store/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import StatCard from "@/Components/Cards/StatsCard";
import QuickAction from "@/Components/DashBoard/QuickAction";
import {
  Users,
  Briefcase,
  Building2,
  UserCheck,
  TrendingUp,
  Activity,
  Eye,
  Menu,
  X,
} from "lucide-react";
export default function AdminDashBoard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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

  const quickActions = [
    { icon: Eye, label: "Review Applications", count: 23 },
    { icon: Briefcase, label: "Approve Jobs", count: 12 },
    { icon: Users, label: "Verify Employers", count: 8 },
    { icon: Activity, label: "System Reports", count: 3 },
  ];

  const stats = [
    {
      icon: Users,
      title: "Total Users",
      total: data?.totalUsers || 0,
      active: data?.activeUsers || null,
      color: "from-blue-500 to-blue-600",
      trend: 12,
    },
    {
      icon: Briefcase,
      title: "Job Postings",
      total: data?.totalJobs || 0,
      active: data?.activeJobs || null,
      color: "from-emerald-500 to-emerald-600",
      trend: 8,
    },
    {
      icon: Building2,
      title: "Employers",
      total: data?.totalEmployer || 0,
      active: null,
      color: "from-purple-500 to-purple-600",
      trend: 5,
    },
    {
      icon: UserCheck,
      title: "Applicants",
      total: data?.totalApplicant || 0,
      active: null,
      color: "from-orange-500 to-orange-600",
      trend: 15,
    },
  ];
  if (loading) return <div>Loading</div>;
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 backdrop-blur-lg bg-white/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
              >
                {isSidebarOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Admin Dashboard
                  </h1>
                  <p className="text-xs text-gray-500">
                    JobTracker Control Panel
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                System Healthy
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full"></div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, Admin
              </h2>
              <p className="text-gray-600">
                Here's what's happening with your platform today
              </p>
            </div>
            <div className="hidden lg:flex items-center gap-2 text-sm text-gray-500">
              <Activity className="w-4 h-4" />
              Last updated: Just now
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {data &&
            stats.map((stat, index) => <StatCard key={index} {...stat} />)}
        </div>

        {/* Quick Actions & Activity */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                {quickActions.map((action, index) => (
                  <QuickAction key={index} {...action} />
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Recent Activity
                </h3>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  View All
                </button>
              </div>

              <div className="space-y-4">
                {[
                  {
                    user: "John Doe",
                    action: "applied for Senior Developer position",
                    time: "5 minutes ago",
                    avatar: "from-blue-500 to-blue-600",
                  },
                  {
                    user: "Tech Corp",
                    action: "posted a new job: Product Manager",
                    time: "23 minutes ago",
                    avatar: "from-emerald-500 to-emerald-600",
                  },
                  {
                    user: "Jane Smith",
                    action: "updated profile information",
                    time: "1 hour ago",
                    avatar: "from-purple-500 to-purple-600",
                  },
                  {
                    user: "Startup Inc",
                    action: "shortlisted 5 candidates",
                    time: "2 hours ago",
                    avatar: "from-orange-500 to-orange-600",
                  },
                ].map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div
                      className={`w-10 h-10 rounded-full bg-gradient-to-br ${activity.avatar} flex-shrink-0`}
                    ></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">
                        <span className="font-semibold">{activity.user}</span>{" "}
                        {activity.action}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Stats Bar */}
        {/* <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Avg. Response Time", value: "2.4h", trend: "down" },
            { label: "Success Rate", value: "94.2%", trend: "up" },
            { label: "Daily Active Users", value: "1.2K", trend: "up" },
            { label: "Platform Uptime", value: "99.9%", trend: "stable" },
          ].map((metric, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-4 border border-gray-100"
            >
              <p className="text-xs text-gray-500 mb-1">{metric.label}</p>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold text-gray-900">
                  {metric.value}
                </p>
                {metric.trend === "up" && (
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                )}
              </div>
            </div>
          ))}
        </div> */}
      </main>
    </div>
  );
}
