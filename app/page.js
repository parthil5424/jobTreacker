"use client";

import React, { useState, useEffect } from "react";
import {
  Briefcase,
  Upload,
  CheckCircle,
  ArrowRight,
  Menu,
  X,
  Sparkles,
  Users,
  TrendingUp,
} from "lucide-react";
import LandingNavbar from "@/Components/LandingNavbar";

export default function Home() {
  const features = [
    {
      icon: <Briefcase className="w-8 h-8" />,
      title: "Post & Manage Jobs",
      description:
        "Create and track job postings with ease. Manage applications in one centralized dashboard.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Upload className="w-8 h-8" />,
      title: "Resume Upload",
      description:
        "Candidates can upload resumes instantly. Smart parsing extracts key information automatically.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "Smart Shortlisting",
      description:
        "AI-powered candidate matching helps you find the perfect fit faster than ever before.",
      color: "from-orange-500 to-red-500",
    },
  ];

  const stats = [
    { number: "10K+", label: "Jobs Posted" },
    { number: "50K+", label: "Active Users" },
    { number: "95%", label: "Success Rate" },
  ];

  // <div className="">
  //   <Link
  //     href="/SignUp"
  //     className="p-4 border-sky-100 w-[100px] bg-green-300 text-black cursor-pointer"
  //   >
  //     SignUp
  //   </Link>
  //   <Link href="/Login">Login</Link>
  // </div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation */}
      <LandingNavbar />
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              {/* <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                AI-Powered Recruitment Platform
              </div> */}

              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Hire Smarter,
                <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Not Harder
                </span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed">
                Streamline your hiring process with our intelligent job tracking
                platform. Post jobs, manage applications, and find the perfect
                candidates—all in one place.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                {stats.map((stat, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      {stat.number}
                    </div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Image/Illustration */}
            <div className="relative">
              <div className="relative z-10 bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                <div className="space-y-4">
                  {/* Mock Dashboard */}
                  <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">
                          Dashboard
                        </div>
                        <div className="text-sm text-gray-500">
                          Active Campaigns
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mock Job Cards */}
                  {[
                    {
                      title: "Senior Developer",
                      applicants: 24,
                      color: "from-blue-500 to-cyan-500",
                    },
                    {
                      title: "Product Designer",
                      applicants: 18,
                      color: "from-purple-500 to-pink-500",
                    },
                    {
                      title: "Marketing Manager",
                      applicants: 31,
                      color: "from-orange-500 to-red-500",
                    },
                  ].map((job, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <div className="font-semibold text-gray-800">
                            {job.title}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Users className="w-4 h-4" />
                            {job.applicants} applicants
                          </div>
                        </div>
                        <div
                          className={`w-12 h-12 bg-gradient-to-br ${job.color} rounded-xl opacity-20`}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full opacity-20 blur-2xl animate-pulse"></div>
              <div
                className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-20 blur-2xl animate-pulse"
                style={{ animationDelay: "1s" }}
              ></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold">
              Everything You Need to
              <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Hire Successfully
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to make recruitment effortless and
              efficient
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="group p-8 bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform duration-300`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-12 md:p-16 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full translate-y-24 -translate-x-24"></div>

            <div className="relative z-10 space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold">
                Ready to Transform Your Hiring?
              </h2>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                Join thousands of companies using JobTracker to find their
                perfect candidates
              </p>
              <button className="px-10 py-4 bg-white text-blue-600 rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 font-bold text-lg">
                Get Started Free
              </button>
              <p className="text-sm text-blue-200">
                No credit card required • 14-day free trial
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Auth Modal */}

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">JobTracker</span>
          </div>
          <p className="text-gray-400 mb-8">Hire smarter, not harder.</p>
          <div className="text-sm text-gray-500">
            © 2025 JobTracker. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
