import { useSecurity } from "../context/SecurityContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import {
  Shield,
  FileCheck,
  Database,
  AlertTriangle,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Badge } from "./ui/badge";

export function Dashboard() {
  const { metrics, policies, dataSources, auditLog } = useSecurity();

  const securityTrendData = [
    { id: "day1", date: "Feb 15", score: 82 },
    { id: "day2", date: "Feb 16", score: 85 },
    { id: "day3", date: "Feb 17", score: 83 },
    { id: "day4", date: "Feb 18", score: 88 },
    { id: "day5", date: "Feb 19", score: 90 },
    { id: "day6", date: "Feb 20", score: 92 },
    { id: "day7", date: "Feb 21", score: metrics.complianceScore },
  ];

  const allPolicyData = [
    { id: "active", name: "Active", value: policies.filter((p) => p.status === "active").length, color: "#10b981" },
    { id: "pending", name: "Pending", value: policies.filter((p) => p.status === "pending").length, color: "#f59e0b" },
    { id: "inactive", name: "Inactive", value: policies.filter((p) => p.status === "inactive").length, color: "#6b7280" },
  ];
  const policyDistributionData = allPolicyData.filter((item) => item.value > 0);
  const hasPolicyData = policyDistributionData.length > 0 && policyDistributionData.some(d => d.value > 0);

  const allDataSourceData = [
    { id: "secure", name: "Secure", value: dataSources.filter((ds) => ds.status === "secure").length },
    { id: "at_risk", name: "At Risk", value: dataSources.filter((ds) => ds.status === "at_risk").length },
    { id: "compromised", name: "Compromised", value: dataSources.filter((ds) => ds.status === "compromised").length },
  ];
  const dataSourceStatusData = allDataSourceData.filter((item) => item.value > 0);
  const hasDataSourceData = dataSourceStatusData.length > 0 && dataSourceStatusData.some(d => d.value > 0);

  const recentActivity = auditLog.slice(0, 5);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Security Dashboard</h1>
        <p className="text-gray-600">
          Monitor and manage your big data security framework
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Compliance Score
            </CardTitle>
            <Shield className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {metrics.complianceScore}%
            </div>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-2">
              <TrendingUp className="w-3 h-3" />
              +5% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Active Policies
            </CardTitle>
            <FileCheck className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {metrics.activePolicies}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              of {metrics.totalPolicies} total policies
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Secure Data Sources
            </CardTitle>
            <Database className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {metrics.secureDataSources}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              of {metrics.totalDataSources} data sources
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Verification Rate
            </CardTitle>
            <CheckCircle2 className="w-4 h-4 text-cyan-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {metrics.verificationRate}%
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Policy integrity checks
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {metrics.recentViolations > 0 && (
        <Card className="mb-8 border-orange-200 bg-orange-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <CardTitle className="text-orange-900">Security Alerts</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-orange-800">
              {metrics.recentViolations} data source(s) require immediate attention
            </p>
          </CardContent>
        </Card>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Security Compliance Trend</CardTitle>
            <CardDescription>7-day compliance score history</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={securityTrendData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis
                  dataKey="date"
                  stroke="#6b7280"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis
                  stroke="#6b7280"
                  fontSize={12}
                  domain={[0, 100]}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: "#3b82f6", r: 4 }}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Policy Status Distribution</CardTitle>
            <CardDescription>Current policy states</CardDescription>
          </CardHeader>
          <CardContent>
            {hasPolicyData ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <Pie
                    data={policyDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="id"
                    isAnimationActive={false}
                  >
                    {policyDistributionData.map((entry) => (
                      <Cell key={`cell-${entry.id}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-400">
                No policy data available
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Source Security Status</CardTitle>
            <CardDescription>Protection level overview</CardDescription>
          </CardHeader>
          <CardContent>
            {hasDataSourceData ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dataSourceStatusData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis
                    dataKey="name"
                    stroke="#6b7280"
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#6b7280"
                    fontSize={12}
                    allowDecimals={false}
                    tickLine={false}
                  />
                  <Tooltip />
                  <Bar
                    dataKey="value"
                    fill="#8b5cf6"
                    radius={[8, 8, 0, 0]}
                    isAnimationActive={false}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-400">
                No data source information available
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest security events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((entry) => (
                  <div key={entry.id} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0">
                    <div className={`p-1.5 rounded-lg ${
                      entry.action === "create" ? "bg-green-100" :
                      entry.action === "update" ? "bg-blue-100" :
                      entry.action === "verify" ? "bg-purple-100" :
                      "bg-red-100"
                    }`}>
                      {entry.action === "create" && <FileCheck className="w-4 h-4 text-green-600" />}
                      {entry.action === "update" && <Shield className="w-4 h-4 text-blue-600" />}
                      {entry.action === "verify" && <CheckCircle2 className="w-4 h-4 text-purple-600" />}
                      {entry.action === "delete" && <AlertTriangle className="w-4 h-4 text-red-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{entry.entityName}</p>
                      <p className="text-xs text-gray-500 truncate">{entry.details}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-400">
                          {entry.timestamp.toLocaleString()}
                        </span>
                        {entry.verified && (
                          <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                            Verified
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-400 py-8">
                  No recent activity
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
