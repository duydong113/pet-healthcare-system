"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Users,
  PawPrint,
  Calendar,
  Receipt,
  TrendingUp,
  Clock,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  petOwnerAPI,
  petAPI,
  appointmentAPI,
  invoiceAPI,
} from "@/services/api";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    owners: 0,
    pets: 0,
    appointments: 0,
    invoices: 0,
    pendingAppointments: 0,
    unpaidInvoices: 0,
  });
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [ownersRes, petsRes, appointmentsRes, invoicesRes] =
        await Promise.all([
          petOwnerAPI.getAll(),
          petAPI.getAll(),
          appointmentAPI.getAll(),
          invoiceAPI.getAll(),
        ]);

      const pendingAppointments = appointmentsRes.data.filter(
        (a: any) => a.status === "Pending"
      ).length;

      const unpaidInvoices = invoicesRes.data.filter(
        (i: any) => i.payment_status === "Pending"
      ).length;

      setStats({
        owners: ownersRes.data.length,
        pets: petsRes.data.length,
        appointments: appointmentsRes.data.length,
        invoices: invoicesRes.data.length,
        pendingAppointments,
        unpaidInvoices,
      });

      // Process chart data
      const processedChartData = processChartData(appointmentsRes.data);
      setChartData(processedChartData);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const processChartData = (appointments: any[]) => {
    const dateMap = new Map();

    appointments.forEach((appointment) => {
      const date = new Date(appointment.appointment_date)
        .toISOString()
        .split("T")[0];
      const status = appointment.status;

      if (!dateMap.has(date)) {
        dateMap.set(date, {
          date,
          Pending: 0,
          Completed: 0,
          Canceled: 0,
        });
      }

      const dayData = dateMap.get(date);
      dayData[status] = (dayData[status] || 0) + 1;
    });

    // Sort by date and take last 30 days
    const sortedData = Array.from(dateMap.values())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-30);

    return sortedData;
  };

  // Calculate max value for Y-axis ticks
  const getMaxValue = () => {
    if (chartData.length === 0) return 5;
    const maxPending = Math.max(...chartData.map((d) => d.Pending || 0));
    const maxCompleted = Math.max(...chartData.map((d) => d.Completed || 0));
    const maxCanceled = Math.max(...chartData.map((d) => d.Canceled || 0));
    return Math.max(maxPending, maxCompleted, maxCanceled, 5);
  };

  const yAxisTicks = Array.from({ length: getMaxValue() + 1 }, (_, i) => i);

  const statCards = [
    {
      title: "Pet Owners",
      value: stats.owners,
      icon: Users,
      color: "blue",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      borderColor: "border-blue-200",
    },
    {
      title: "Total Pets",
      value: stats.pets,
      icon: PawPrint,
      color: "green",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      borderColor: "border-green-200",
    },
    {
      title: "Appointments",
      value: stats.appointments,
      icon: Calendar,
      color: "purple",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      borderColor: "border-purple-200",
    },
    {
      title: "Invoices",
      value: stats.invoices,
      icon: Receipt,
      color: "orange",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
      borderColor: "border-orange-200",
    },
  ];

  const alertCards = [
    {
      title: "Pending Appointments",
      value: stats.pendingAppointments,
      icon: Clock,
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-600",
      borderColor: "border-yellow-200",
    },
    {
      title: "Unpaid Invoices",
      value: stats.unpaidInvoices,
      icon: TrendingUp,
      bgColor: "bg-red-50",
      iconColor: "text-red-600",
      borderColor: "border-red-200",
    },
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome to VNU Pet Healthcare Management System
          </p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.title}
                className={`bg-white p-6 rounded-xl shadow-sm border ${stat.borderColor} hover:shadow-md transition-all hover:scale-105`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-4 rounded-xl ${stat.bgColor}`}>
                    <Icon className={stat.iconColor} size={28} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Alert Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {alertCards.map((alert) => {
            const Icon = alert.icon;
            return (
              <div
                key={alert.title}
                className={`bg-white p-6 rounded-xl shadow-sm border ${alert.borderColor}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${alert.bgColor}`}>
                    <Icon className={alert.iconColor} size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{alert.title}</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {alert.value}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a
              href="/dashboard/pet-owners"
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer group"
            >
              <Users
                className="mx-auto mb-2 text-gray-400 group-hover:text-blue-600"
                size={32}
              />
              <p className="text-sm font-medium text-gray-700 text-center">
                Add Owner
              </p>
            </a>
            <a
              href="/dashboard/pets"
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all cursor-pointer group"
            >
              <PawPrint
                className="mx-auto mb-2 text-gray-400 group-hover:text-green-600"
                size={32}
              />
              <p className="text-sm font-medium text-gray-700 text-center">
                Add Pet
              </p>
            </a>
            <a
              href="/dashboard/appointments"
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all cursor-pointer group"
            >
              <Calendar
                className="mx-auto mb-2 text-gray-400 group-hover:text-purple-600"
                size={32}
              />
              <p className="text-sm font-medium text-gray-700 text-center">
                New Appointment
              </p>
            </a>
            <a
              href="/dashboard/invoices"
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all cursor-pointer group"
            >
              <Receipt
                className="mx-auto mb-2 text-gray-400 group-hover:text-orange-600"
                size={32}
              />
              <p className="text-sm font-medium text-gray-700 text-center">
                Create Invoice
              </p>
            </a>
          </div>
        </div>

        {/* Appointments Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Appointments Overview
              </h2>
              <p className="text-sm text-gray-600">
                Daily appointments by status (last 30 days)
              </p>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  domain={[0, "dataMax"]}
                  ticks={yAxisTicks}
                  interval={0}
                />
                <Tooltip
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  }
                  formatter={(value, name) => [value, name]}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="Pending"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={{ fill: "#f59e0b", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="Completed"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="Canceled"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
