"use client"

import { QueryClient, QueryClientProvider, useQuery } from "react-query"
import SalesGraph from "./SalesGraph"

const queryClient = new QueryClient()

const fetchSalesData = async () => {
  const response = await fetch("http://localhost:8000/process-data")
  if (!response.ok) {
    throw new Error("Network response was not ok")
  }
  return response.json()
}

function SalesGraphWithData() {
  const { data, isLoading, error } = useQuery("salesData", fetchSalesData, {
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  return <SalesGraph data={data} isLoading={isLoading} error={error} />
}

export default function SalesGraphWithQuery() {
  return (
    <QueryClientProvider client={queryClient}>
      <SalesGraphWithData />
    </QueryClientProvider>
  )
}