"use client"

import { useQuery } from "react-query"
import SalesGraph from "./SalesGraph"

const fetchSalesData = async () => {
  const response = await fetch("/api/process-data")
  if (!response.ok) {
    throw new Error("Network response was not ok")
  }
  return response.json()
}

export default function SalesGraphWithQuery() {
  const { data, isLoading, error } = useQuery("salesData", fetchSalesData, {
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  return <SalesGraph data={data} isLoading={isLoading} error={error} />
}