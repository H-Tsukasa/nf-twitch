'use client'

import * as React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from "react-query/devtools";

const queryClient: QueryClient = new QueryClient({
    defaultOptions: {
            queries: {
                refetchOnWindowFocus: false,
                staleTime: 1000 * 60 * 5,
                cacheTime: Infinity,
        },
    },
})

export function ReactQueryProvider({ children }:any) {
    return <QueryClientProvider client={queryClient}><ReactQueryDevtools initialIsOpen={true}/>{children}</QueryClientProvider>;
}