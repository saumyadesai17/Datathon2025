"use client"

import { useState } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"
import { salesData, categoryData } from "../mockData"

type TimeFrame = "daily" | "weekly" | "monthly" | "yearly"
type ChartType = "line" | "bar"

export default function SalesGraph() {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("monthly")
  const [chartType, setChartType] = useState<ChartType>("line")
  const [showCategories, setShowCategories] = useState(false)

  const data = showCategories ? categoryData : salesData[timeFrame]
  const xKey = showCategories
    ? "category"
    : timeFrame === "daily"
      ? "date"
      : timeFrame === "weekly"
        ? "week"
        : timeFrame === "monthly"
          ? "month"
          : "year"

  return (
    <div className="glass-card p-6 rounded-xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold gradient-text">Sales Performance</h2>
        <div className="flex flex-wrap gap-4">
          <select
            value={timeFrame}
            onChange={(e) => setTimeFrame(e.target.value as TimeFrame)}
            className="glass-select px-4 py-2 rounded-lg border border-gray-700 focus:border-[#00f3ff] bg-transparent text-white"
            disabled={showCategories}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value as ChartType)}
            className="glass-select px-4 py-2 rounded-lg border border-gray-700 focus:border-[#00f3ff] bg-transparent text-white"
          >
            <option value="line">Line</option>
            <option value="bar">Bar</option>
          </select>
          <button
            onClick={() => setShowCategories(!showCategories)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              showCategories
                ? "bg-gradient-to-r from-[#00f3ff]/20 to-[#00ff9d]/20 border border-[#00f3ff]/40"
                : "glass-card hover:border-[#00f3ff]/40"
            }`}
          >
            {showCategories ? "Show Timeline" : "Show Categories"}
          </button>
        </div>
      </div>

      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "line" ? (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey={xKey} stroke="#ffffff" tick={{ fill: "#ffffff" }} />
              <YAxis stroke="#ffffff" tick={{ fill: "#ffffff" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0,0,0,0.8)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              {showCategories ? (
                <>
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#00f3ff"
                    strokeWidth={2}
                    dot={{ fill: "#00f3ff" }}
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="growth"
                    stroke="#00ff9d"
                    strokeWidth={2}
                    dot={{ fill: "#00ff9d" }}
                    activeDot={{ r: 8 }}
                  />
                </>
              ) : (
                <>
                  <Line
                    type="monotone"
                    dataKey="outlet1"
                    stroke="#00f3ff"
                    strokeWidth={2}
                    dot={{ fill: "#00f3ff" }}
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="outlet2"
                    stroke="#00ff9d"
                    strokeWidth={2}
                    dot={{ fill: "#00ff9d" }}
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="outlet3"
                    stroke="#ff0055"
                    strokeWidth={2}
                    dot={{ fill: "#ff0055" }}
                    activeDot={{ r: 8 }}
                  />
                </>
              )}
            </LineChart>
          ) : (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey={xKey} stroke="#ffffff" tick={{ fill: "#ffffff" }} />
              <YAxis stroke="#ffffff" tick={{ fill: "#ffffff" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(15,23,42,0.9)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              {showCategories ? (
                <>
                  <Bar dataKey="sales" fill="#00f3ff" />
                  <Bar dataKey="growth" fill="#00ff9d" />
                </>
              ) : (
                <>
                  <Bar dataKey="outlet1" fill="#00f3ff" />
                  <Bar dataKey="outlet2" fill="#00ff9d" />
                  <Bar dataKey="outlet3" fill="#ff0055" />
                </>
              )}
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  )
}

