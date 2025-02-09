"use client"

import { useState, useMemo } from "react"
import { useQuery, QueryClient, QueryClientProvider } from "react-query"

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

const fetchMostSoldItems = async (): Promise<MostSoldItem[]> => {
  const response = await fetch("https://datathon2025.onrender.com/most_sold_items")
  const data: BackendResponse = await response.json()

  return Object.keys(data).map((outlet) => ({
    outlet,
    item: data[outlet]["Most Sold Item Name"],
    quantity: data[outlet]["Count"],
  }))
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
      <div className="flex space-x-4 mb-6 overflow-x-auto pb-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-24 h-10 bg-white/10 rounded-lg animate-pulse flex-shrink-0" />
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

function MostSoldItemsContent() {
  const [activeIndex, setActiveIndex] = useState<number>(0)

  const {
    data: mostSoldItems,
    isLoading,
    error,
  } = useQuery<MostSoldItem[], Error>("mostSoldItems", fetchMostSoldItems, {
    staleTime: 60000, // 1 minute
    cacheTime: 3600000, // 1 hour
  })

  const activeItem = useMemo(() => mostSoldItems && mostSoldItems[activeIndex], [mostSoldItems, activeIndex])

  if (error) {
    return <div className="text-red-500">Error loading data: {error.message}</div>
  }

  return (
    <div className="glass-card p-6 rounded-xl">
      <h2 className="text-2xl font-bold gradient-text mb-6">Most Sold Items</h2>

      {isLoading ? (
        <SkeletonLoader />
      ) : (
        mostSoldItems && (
          <>
            <div className="flex space-x-4 mb-6 overflow-x-auto pb-2">
              {mostSoldItems.map((item, index) => (
                <button
                  key={item.outlet}
                  onClick={() => setActiveIndex(index)}
                  className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                    activeIndex === index
                      ? "bg-gradient-to-r from-[#00f3ff]/20 to-[#00ff9d]/20 border border-[#00f3ff]/40"
                      : "hover:bg-white/5"
                  }`}
                >
                  {item.outlet}
                </button>
              ))}
            </div>

            {activeItem && (
              <div className="grid grid-cols-2 gap-6">
                <InfoCard title="Item Name" value={activeItem.item} borderColor="border-[#00f3ff]/20" />
                <InfoCard
                  title="Quantity Sold"
                  value={activeItem.quantity.toLocaleString()}
                  borderColor="border-[#00ff9d]/20"
                />
                <InfoCard title="Revenue" value={`₹${activeItem.quantity * 5}`} borderColor="border-[#00f3ff]/20" />
                <GrowthCard value={activeItem.quantity} borderColor="border-[#00ff9d]/20" />
              </div>
            )}
          </>
        )
      )}
    </div>
  )
}

const queryClient = new QueryClient()

export default function MostSoldItems() {
  return (
    <QueryClientProvider client={queryClient}>
      <MostSoldItemsContent />
    </QueryClientProvider>
  )
}