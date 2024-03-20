'use client'

import * as React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import apiClient from '@/hooks/api-client';

import { Video } from '@/types/video';
import { Clip } from '@/types/clip';

import { useQuery } from 'react-query';
import { OverlaySpinner } from '../overlay-spinner';

const queryClient: QueryClient = new QueryClient({
    defaultOptions: {
            queries: {
                refetchOnWindowFocus: false,
                staleTime: 1000 * 60 * 5,
                cacheTime: Infinity,
        },
    },
})

export function GetDataProvider() {
    // videoとclipを事前に取得
    // videoの取得
    const fetchVideos = async() => {
        const { data } = await apiClient.request<Video[]>({
                url: `/videos/`,
                method: "GET"
            })
        return data
    }
    // clipの取得
    const fetchClips = async() => {
        const { data } = await apiClient.request<Clip[]>({
                url: `/clips/`,
                method: "GET"
            })
        return data
    }
    const { data: videos, isLoading: isLoadingVideos, error: errorVideos } = useQuery(['videos'], fetchVideos)
    const { data: clips, isLoading: isLoadingClips, error: errorClips } = useQuery(['clips'], fetchClips)
    if(errorClips || errorVideos){
        return <p>エラー</p>
    }
    if(isLoadingClips || isLoadingVideos){
        return <OverlaySpinner></OverlaySpinner>
    }
    return <span></span>
}