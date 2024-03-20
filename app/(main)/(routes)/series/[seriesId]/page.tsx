"use client"

import apiClient from "@/hooks/api-client";

import { QueryClient, useQuery, useQueryClient } from 'react-query';
import { useEffect, useState } from "react";

import { Series } from "@/types/series";
import { Streamer } from "@/types/streamer";
import { Video } from "@/types/video";
import { Clip } from "@/types/clip";

import { SeriesHeader } from "@/components/series/series-header";
import { SeriesMain } from "@/components/series/series-main";
import { OverlaySpinner } from "@/components/overlay-spinner";


// const test_series: Series = {
//   id: 31,
//   user_id: "a",
//   uu_id: "test",
//   name: "test_series",
//   date_start: "2023-12-28T15:00:00.000Z",
//   date_end: "2024-01-10T15:00:00.000Z",
//   game_id: null,
//   thumbnail_url: null
// }

// const test_streamer: Streamer = {
//   id: 1,
//   uuid: "test",
//   profile_id: "343",
//   display_name: "shakach",
//   profile_image_url: "https://static-cdn.jtvnw.net/jtv_user_pictures/61f568bf-884b-4126-b17c-fc525c6d3bd4-profile_image-300x300.png"
// }

const ServerIdPage = ({
  params,
}: {
  params: { seriesId: string };
}) => {
  const [type, setType] = useState<string>("video");
  const queryClient = useQueryClient();
  const videos: Video[] | undefined = queryClient.getQueryData("videos")
  const clips: Clip[] | undefined = queryClient.getQueryData("clips")

  // videoとclipの切り替え
  const handleOptionChange = (event:any) => {
    setType(event.target.value)
  }

  // 時系列の取得
  const fetchSeries = async() => {
    const { data } = await apiClient.request<Series>({
        url: `/series/${params.seriesId}`,
        method: "GET"
    })
    return data
  };

  // ストリーマーの取得
  const fetchStreamers = async() => {
    const { data } = await apiClient.request<Streamer[]>({
        url: `/streamer_series/streamers/${params.seriesId}`,
        method: "GET"
    })
    return data
  };

  // ビデオの取得
  const fetchVideos = async() => {
    let tmp_videos: Video[] = []
    // console.log(streamers?.length)
    if(streamers){
      for(const streamer of streamers){
        const { data } = await apiClient.request<Video[]>({
          url: `/videos/${streamer.id}`,
          method: "GET"
        })
        tmp_videos = tmp_videos.concat(data)
      }
      return tmp_videos
    }
  }

  // クリップの取得
  const fetchClips = async() => {
    let tmp_clips: Clip[] = []
    // console.log(streamers?.length)
    if(streamers){
      for(const streamer of streamers){
        const { data } = await apiClient.request<Clip[]>({
          url: `/clips/${streamer.id}`,
          method: "GET"
        })
        tmp_clips = tmp_clips.concat(data)
      }
      return tmp_clips
    }
  }

  // 各取得の処理
  const { data: series, isLoading: isLoadingSeries, error: errorSeries } = useQuery(['series', params.seriesId], fetchSeries)
  const { data: streamers, isLoading: isLoadingStreamers, error: errorStreamers } = useQuery(['streamers', params.seriesId], fetchStreamers)
  // ストリーマーに対応したvideo, clipの取得
  // let use_videos: Video[] = []
  // let use_clips: Clip[] = []
  // useEffect(() => {
  //   if(streamers && videos && clips){
  //     for(const streamer of streamers){
  //       for(const video of videos){
  //         if(video.streamer_id == streamer.id){
  //           use_videos.push(video)
  //         }
  //       }
  //       for(const clip of clips){
  //         if(clip.streamer_id == streamer.id){
  //           use_clips.push(clip)
  //         }
  //       }
  //     }
  //   }
  // }, [streamers])
  // const { data: videos, isLoading: isLoadingVideos, error: errorVideos } = useQuery(['videos', params.seriesId], fetchVideos, {
  //   enabled: !!streamers
  // })
  // const { data: clips, isLoading: isLoadingClips, error: errorClips } = useQuery(['clips', params.seriesId], fetchClips, {
  //   enabled: !!streamers
  // })

  // if(errorSeries || errorStreamers || errorClips || errorVideos){
  //   <p>エラー</p>
  // }
  if(errorSeries || errorStreamers){
    <p>エラー</p>
  }

  // if(isLoadingSeries || isLoadingStreamers || isLoadingClips || isLoadingVideos){
  //   return <OverlaySpinner></OverlaySpinner>
  // }
  if(isLoadingSeries || isLoadingStreamers){
    return <OverlaySpinner></OverlaySpinner>
  }

  if(!series){
    return <OverlaySpinner></OverlaySpinner>
  }

  if(!streamers){
    return <OverlaySpinner></OverlaySpinner>
  }

  return (
      <div className="mt-[3.4rem]">
        <SeriesHeader name={series.name} />
        <div className="m-10">
          <div className="mx-auto text-center">
            <label className="mr-3 text-xl font-bold">
              <input
                type="radio"
                value="video"
                checked={type === "video"}
                onChange={handleOptionChange}
              />
              Video
            </label>
            <label className="mr-3 text-xl font-bold">
              <input
                type="radio"
                value="clip"
                checked={type === "clip"}
                onChange={handleOptionChange}
              />
              Clip
            </label>
            <SeriesMain series={series} streamers={streamers} videos={videos} clips={clips} type={type}/>
          </div>
        </div>
      </div>
  );
};

export default ServerIdPage;
