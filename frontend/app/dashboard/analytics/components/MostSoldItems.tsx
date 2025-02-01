"use client"

import { useState, useEffect } from "react"

interface MostSoldItem {
  outlet: string
  item: string
  quantity: number
}

interface BackendResponse {
  [key: string]: {
    "Most Sold Item ID": number
    "Most Sold Item Name": string
    Count: number
  }
}

export default function MostSoldItems() {
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const [mostSoldItems, setMostSoldItems] = useState<MostSoldItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchMostSoldItems = async () => {
      try {
        const response = await fetch("http://localhost:8000/most_sold_items")
        const data: BackendResponse = await response.json()

        const items = Object.keys(data).map((outlet) => ({
          outlet,
          item: data[outlet]["Most Sold Item Name"],
          quantity: data[outlet]["Count"],
        }))

        setMostSoldItems(items)
      } catch (error) {
        console.error("Error fetching most sold items:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMostSoldItems()
  }, [])

  return (
    <div className="glass-card p-6 rounded-xl">
      <h2 className="text-2xl font-bold gradient-text mb-6">Most Sold Items</h2>

      {isLoading ? (
        <SkeletonLoader />
      ) : (
        <>
          <div className="flex space-x-4 mb-6">
            {mostSoldItems.map((item, index) => (
              <button
                key={item.outlet}
                onClick={() => setActiveIndex(index)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeIndex === index
                    ? "bg-gradient-to-r from-[#00f3ff]/20 to-[#00ff9d]/20 border border-[#00f3ff]/40"
                    : "hover:bg-white/5"
                }`}
              >
                {item.outlet}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-6">
            <InfoCard title="Item Name" value={mostSoldItems[activeIndex].item} borderColor="border-[#00f3ff]/20" />
            <InfoCard
              title="Quantity Sold"
              value={mostSoldItems[activeIndex].quantity.toLocaleString()}
              borderColor="border-[#00ff9d]/20"
            />
            <InfoCard
              title="Revenue"
              value={`$${mostSoldItems[activeIndex].quantity * 5}`}
              borderColor="border-[#00f3ff]/20"
            />
            <GrowthCard value={mostSoldItems[activeIndex].quantity} borderColor="border-[#00ff9d]/20" />
          </div>
        </>
      )}
    </div>
  )
}

function InfoCard({ title, value, borderColor }: { title: string; value: string | number; borderColor: string }) {
  return (
    <div className={`glass-card p-4 rounded-lg border ${borderColor}`}>
      <p className="text-sm text-gray-400">{title}</p>
      <p className="text-2xl font-bold text-white mt-1">{value}</p>
    </div>
  )
}

function GrowthCard({ value, borderColor }: { value: number; borderColor: string }) {
  const isPositive = value > 500
  return (
    <div className={`glass-card p-4 rounded-lg border ${borderColor}`}>
      <p className="text-sm text-gray-400">Growth</p>
      <p className={`text-2xl font-bold mt-1 ${isPositive ? "text-[#00ff9d]" : "text-[#ff0055]"}`}>
        {isPositive ? "+" : ""}
        {isPositive ? "15%" : "5%"}
      </p>
    </div>
  )
}

function SkeletonLoader() {
  return (
    <>
      <div className="flex space-x-4 mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-24 h-10 bg-white/10 rounded-lg animate-pulse" />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="glass-card p-4 rounded-lg border border-white/20">
            <div className="w-20 h-4 bg-white/10 rounded animate-pulse mb-2" />
            <div className="w-32 h-8 bg-white/10 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </>
  )
}

