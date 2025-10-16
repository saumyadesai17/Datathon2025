"use client"

import { QueryClient, QueryClientProvider } from "react-query"
import { useState } from "react"

export default function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode
}) {
  // Create a stable QueryClient instance that persists across renders
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            cacheTime: 5 * 60 * 1000, // 5 minutes
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            retry: 1,
          },
        },
      })
  )

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
