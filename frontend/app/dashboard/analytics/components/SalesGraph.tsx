"use client"

import { useState, useMemo } from "react"
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
import { motion, AnimatePresence } from "framer-motion"

// Define types
interface Sale {
    Order_Date: string
    Order_Bill: number
}

interface OutletData {
    filename: string
    sales: Sale[]
}

interface SalesGraphProps {
    data: any
    isLoading: boolean
    error: any
}

export default function SalesGraph({ data, isLoading, error }: SalesGraphProps) {
    const [timeFrame, setTimeFrame] = useState("monthly")
    const [chartType, setChartType] = useState("line")

    const colors = ["#00f3ff", "#00ff9d", "#ff9900", "#ffdd00", "#ff33cc", "#ff6600", "#00ccff", "#ff0000"];

    const formatDate = (date: string) => {
        const parsedDate = new Date(date)
        return `${String(parsedDate.getDate()).padStart(2, "0")}-${String(parsedDate.getMonth() + 1).padStart(
            2,
            "0",
        )}-${parsedDate.getFullYear()}`
    }

    const getWeekNumber = (date: Date) => {
        const startDate = new Date(date.getFullYear(), 0, 1)
        const days = Math.floor((date.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000))
        return Math.ceil((days + 1) / 7)
    }

    const formatSalesData = useMemo(() => {
        if (!data) return []

        const mergedSales: Record<string, any> = {}

        data.results.forEach((outlet: OutletData) => {
            outlet.sales.forEach(({ Order_Date, Order_Bill }) => {
                const formattedDate = formatDate(Order_Date)
                let timeFrameKey = ""

                const date = new Date(Order_Date)
                if (timeFrame === "daily") {
                    timeFrameKey = formattedDate
                } else if (timeFrame === "weekly") {
                    const weekNumber = getWeekNumber(date)
                    timeFrameKey = `${date.getFullYear()}-W${weekNumber}`
                } else if (timeFrame === "monthly") {
                    timeFrameKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`
                } else if (timeFrame === "yearly") {
                    timeFrameKey = `${date.getFullYear()}`
                }

                if (!mergedSales[timeFrameKey]) {
                    mergedSales[timeFrameKey] = { date: timeFrameKey }
                }

                mergedSales[timeFrameKey][outlet.filename] = (mergedSales[timeFrameKey][outlet.filename] || 0) + Order_Bill
            })
        })

        return Object.values(mergedSales).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    }, [data, timeFrame, formatDate, getWeekNumber])

    if (error) {
        return <div className="text-red-500">Error loading sales data. Please try again later.</div>
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="glass-card p-6 rounded-xl"
        >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold gradient-text">Sales Performance</h2>
                <div className="flex flex-wrap gap-4">
                    <select
                        value={timeFrame}
                        onChange={(e) => setTimeFrame(e.target.value)}
                        className="glass-select px-4 py-2 rounded-lg border border-gray-700 focus:border-[#00f3ff] bg-gray-800 text-white focus:bg-gray-900"
                    >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                    </select>
                    <select
                        value={chartType}
                        onChange={(e) => setChartType(e.target.value)}
                        className="glass-select px-4 py-2 rounded-lg border border-gray-700 focus:border-[#00f3ff] bg-gray-800 text-white focus:bg-gray-900"
                    >
                        <option value="line">Line</option>
                        <option value="bar">Bar</option>
                    </select>
                </div>
            </div>
            <div className="h-[400px]">
                <AnimatePresence mode="wait">
                    {isLoading ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-full h-full flex items-center justify-center"
                        >
                            <div className="loader"></div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="chart"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-full h-full"
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                {chartType === "line" ? (
                                    <LineChart data={formatSalesData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                        <XAxis
                                            dataKey="date"
                                            stroke="#ffffff"
                                            tick={{ fill: "#ffffff", fontSize: 12 }}
                                            angle={-45}
                                            textAnchor="end"
                                            height={60}
                                        />
                                        <YAxis stroke="#ffffff" tick={{ fill: "#ffffff" }} />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: "rgba(0,0,0,0.8)",
                                                border: "1px solid rgba(255,255,255,0.1)",
                                                borderRadius: "8px",
                                            }}
                                        />
                                        <Legend />
                                        {formatSalesData.length > 0 &&
                                            Object.keys(formatSalesData[0])
                                                .filter((key) => key !== "date")
                                                .map((key, index) => (
                                                    <Line
                                                        key={key}
                                                        type="monotone"
                                                        dataKey={key}
                                                        stroke={colors[index % colors.length]} // Use dynamic color assignment
                                                        strokeWidth={2}
                                                        dot={{ fill: colors[index % colors.length] }} // Same color for the dot
                                                        activeDot={{ r: 8 }}
                                                    />
                                                ))}
                                    </LineChart>
                                ) : (
                                    <BarChart data={formatSalesData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                        <XAxis
                                            dataKey="date"
                                            stroke="#ffffff"
                                            tick={{ fill: "#ffffff", fontSize: 12 }}
                                            angle={-45}
                                            textAnchor="end"
                                            height={60}
                                        />
                                        <YAxis stroke="#ffffff" tick={{ fill: "#ffffff" }} />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: "rgba(15,23,42,0.9)",
                                                border: "1px solid rgba(255,255,255,0.1)",
                                                borderRadius: "8px",
                                            }}
                                        />
                                        <Legend />
                                        {formatSalesData.length > 0 &&
                                            Object.keys(formatSalesData[0])
                                                .filter((key) => key !== "date")
                                                .map((key, index) => (
                                                    <Bar key={key} dataKey={key} fill={colors[index % colors.length]} /> // Use dynamic color assignment
                                                ))}
                                    </BarChart>
                                )}
                            </ResponsiveContainer>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    )
}

