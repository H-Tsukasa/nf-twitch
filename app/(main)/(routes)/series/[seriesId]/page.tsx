"use client"

import apiClient from "@/apiClient";

import { ChangeEventHandler, useEffect, useState } from "react";

import { Series } from "@/types/series";
import { Streamer } from "@/types/streamer";
import { Video } from "@/types/video";
import { Clip } from "@/types/clip";

import { SeriesHeader } from "@/components/series/series-header";
import { SeriesMain } from "@/components/series/series-main";


const test_series: Series = {
  id: 31,
  user_id: "a",
  uu_id: "test",
  name: "test_series",
  date_start: "2023-12-28T15:00:00.000Z",
  date_end: "2024-01-10T15:00:00.000Z",
  game_id: null,
  thumbnail_url: null
}

const test_streamer: Streamer = {
  id: 1,
  uuid: "test",
  profile_id: "343",
  display_name: "shakach",
  profile_image_url: "https://static-cdn.jtvnw.net/jtv_user_pictures/61f568bf-884b-4126-b17c-fc525c6d3bd4-profile_image-300x300.png"
}

const ServerIdPage = ({
  params,
}: {
  params: { seriesId: string };
}) => {
  const [series, setSeries] = useState<Series>()
  const [streamers, setStreamers] = useState<Streamer[]>([])
  const [error, setError] = useState<string | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [clips, setClips] = useState<Clip[]>([]);
  const [type, setType] = useState<string>("video");
  // seriesの取得
  useEffect(() => {
      const fetchData = async () => {
          try {
              const response = await apiClient.get<Series>(`/series/${params.seriesId}`);
              setSeries(response.data);
          } catch (err) {
              setError("データの取得に失敗しました。");
          }
      };

      fetchData();
  }, [params.seriesId]);

  //登録されているユーザの取得
  useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await apiClient.get<Streamer[]>(`/streamer_series/streamers/${params.seriesId}`);
            setStreamers(response.data);
        } catch (err) {
            setError("データの取得に失敗しました。");
        }
    };

    fetchData();
  }, [params.seriesId]);

  //videoの取得
  useEffect(() => {
    const fetchData = async () => {
      let tmp_videos: Video[] = []
      for(const streamer of streamers){
          try {
              const response = await apiClient.get<Video[]>(`/videos/${streamer.id}`);
              tmp_videos = tmp_videos.concat(response.data)
          } catch (err) {
              setError("データの取得に失敗しました。");
          }
        }
      setVideos(tmp_videos)
    };    
    fetchData();
  }, [streamers]);

    //clipの取得
    useEffect(() => {
      const fetchData = async () => {
        let tmp_clips: Clip[] = []
        for(const streamer of streamers){
            try {
                const response = await apiClient.get<Clip[]>(`/clips/${streamer.id}`);
                tmp_clips = tmp_clips.concat(response.data)
            } catch (err) {
                setError("データの取得に失敗しました。");
            }
          }
        setClips(tmp_clips)
      };    
      fetchData();
    }, [streamers]);

  const handleOptionChange = (event:any) => {
    setType(event.target.value)
  }


  if(error){
    <p>{error}</p>
  }

  // testデータの読み込み
  // const series = test_series
  // const streamers: Streamer[] = []
  // for(let i: number=0; i<=15; i++){
  //   streamers.push(test_streamer)
  // }
  if(!series){
    return <p>Loading...</p>
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
