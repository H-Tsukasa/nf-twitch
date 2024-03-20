import { Series } from "@/types/series"
import { Streamer } from "@/types/streamer"
import { Video } from "@/types/video"

import Image from "next/image"
import { useModal } from "@/hooks/use-modal-store"
import { Clip } from "@/types/clip"

const video_test_data: Video | undefined = {
    id: 101,
    title: "車レース",
    duration: "10h30m51s",
    thumbnail_url: "https://static-cdn.jtvnw.net/cf_vods/d3vd9lfkzbru3h/b769eaf49d980acb9d6d_fps_shaka_40964297783_1704962764//thumb/thumb0-%{width}x%{height}.jpg",
    embed_url: "https://www.twitch.tv/videos/2029146030",
    view_count: 10000,
    date: "2023-12-29T10:00:12Z",
    video_number: "2029146030",
    streamer_id: 1
}

interface SeriesMainProps {
    series: Series,
    streamers: Streamer[],
    videos: Video[] | undefined,
    clips: Clip[] | undefined,
    type: string
}

// 日付に関する関数
const numArray = (key: number): number[]  => {
    const time: number[] = []
    for(let i:number=0; i<=key; i++){
        time.push(i)
    }
    return time
}

const extractDate = (date: string): string => {
    const re_date = (date.substr(0, date.indexOf("T")))
    return re_date
}

const extractTime = (date: string): string[] => {
    const time:string = date.split('T')[1].replace('Z', '');
    const [hours, minutes, seconds] = time.split(":")
    return [hours, minutes];
}

const getDates = (startDate: Date, endDate: Date): string[] => {
    const dates: string[] = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        dates.push(formatDate(new Date(currentDate)));
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
}

const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const formattedDate: string = new Intl.DateTimeFormat('en-US', options).format(date);
    return formattedDate;
}

// 型の定義
type StreamerVideo = {
    streamer: Streamer,
    videos: VideoStyle[]
}

type VideoStyle = {
    video:Video,
    video_pos: string,
    video_height: string,
    view_color: string,
    isIn: number
}

type StreamerClip = {
    streamer: Streamer,
    clips: ClipStyle[]
}

type ClipStyle = {
    clip: Clip,
    clip_pos: string,
    clip_height: string,
    view_color: string,
    isIn: number
}


export const SeriesMain = ({series, streamers, videos, clips, type}: SeriesMainProps) => {
    
    const { onOpen } = useModal();

    // ビデオの位置を決める関数
    const getVideoStyle = (video: Video): VideoStyle => {
        const video_start_time: string[] = extractTime(video.date)
        const hour: number = parseInt(video_start_time[0], 10)
        const minute: number = parseInt(video_start_time[1], 10)
        // 範囲内にあるかをチェック -1なら存在しない 何番目かもチェック
        const isIn = dates.indexOf(formatDate(new Date(extractDate(video.date))))
        // 始点を決める
        const top_pos: string = String(60 * hour + minute + isIn * 24 * 60)
        // 合計時間を取得
        let duration_hour = 0
        let duration_minute = 0
        if(video.duration.includes("h")){
            const [h, m, s] = video.duration.split(/[hms]/).filter(Boolean).map(Number);
            duration_hour = h
            duration_minute = m
        }else{
            const [m, s] = video.duration.split(/[ms]/).filter(Boolean).map(Number);
            duration_minute = m
        }

        // 最終日の日をまたがないかチェック TODO

        // videoの位置
        const video_pos: string = `${top_pos}px`
        const video_height: string = `${String(60 * duration_hour + duration_minute)}px`
        // 視聴回数による色の変更
        let view_color: string = "#6366f1"
        if(video.view_count >= 1000000){
            view_color = "#4338ca"
        }else if(video.view_count < 1000000 && video.view_count >= 500000){
            view_color = "#6366f1"
        }else if(video.view_count < 500000 && video.view_count >= 100000){
            view_color = "#818cf8"
        }else if (video.view_count < 100000 && video.view_count >= 40000){
            view_color = "#a5b4fc"
        }else{
            view_color = "#c7d2fe"
        }
        const video_style: VideoStyle = {
            video: video,
            video_pos: video_pos,
            video_height: video_height,
            view_color: view_color,
            isIn: isIn
        }
        return video_style
    }

    // クリップの位置を決める関数
    const getClipStyle = (clip: Clip): ClipStyle => {
        const clip_start_time: string[] = extractTime(clip.date)
        const hour: number = parseInt(clip_start_time[0], 10)
        const minute: number = parseInt(clip_start_time[1], 10)
        // 範囲内にあるかをチェック -1なら存在しない 何番目かもチェック
        const isIn = dates.indexOf(formatDate(new Date(extractDate(clip.date))))
        // 始点を決める
        const top_pos: string = String(60 * hour + minute + isIn * 24 * 60)
        // 合計時間を取得
        let duration_hour = 0
        let duration_minute = 0
        // 最終日の日をまたがないかチェック TODO
        // クリップの位置
        const clip_pos: string = `${top_pos}px`
        const clip_height: string = `10px`
        // 視聴回数で色分け
        let view_color: string = "#6366f1"
        if(clip.view_count >= 100000){
            view_color = "#4338ca"
        }else if(clip.view_count < 100000 && clip.view_count >= 50000){
            view_color = "#6366f1"
        }else if(clip.view_count < 50000 && clip.view_count >= 10000){
            view_color = "#818cf8"
        }else if (clip.view_count < 10000 && clip.view_count >= 5000){
            view_color = "#a5b4fc"
        }else{
            view_color = "#c7d2fe"
        }
        const clip_style: ClipStyle = {
            clip: clip,
            clip_pos: clip_pos,
            clip_height: clip_height,
            view_color: view_color,
            isIn: isIn
        }
        return clip_style
    }

    // seriesの時間範囲
    const dates: string[] = getDates(new Date(extractDate(series.date_start)), new Date(extractDate(series.date_end)))

    // gridの定義
    const gridHeight: string = `${dates.length*1440}px`
    const gridNum: number[] = []
    for(let i:number=0; i<dates.length*24; i++){
        gridNum.push(i)
    }

    // streamerとvideoの関係定義
    const streamer_videos: StreamerVideo[] = []
    for(const streamer of streamers){
        let tmp_streamer_video: StreamerVideo
        let video_styles: VideoStyle[] = []
        if(videos){
            for(const video of videos){
                if(streamer.id==video.streamer_id){
                    if(getVideoStyle(video)?.isIn!==-1){
                        video_styles.push(getVideoStyle(video))
                    }
                }
            }
            tmp_streamer_video = {
                streamer: streamer,
                videos: video_styles
            }
            streamer_videos.push(tmp_streamer_video)
        }
    }

    // streamerとclipの関係定義
    const streamer_clips: StreamerClip[] = []
    for(const streamer of streamers){
        let tmp_streamer_clip: StreamerClip
        let clip_styles: ClipStyle[] = []
        if(clips){
            for(const clip of clips){
                if(streamer.id==clip.streamer_id){
                    if(getClipStyle(clip)?.isIn!==-1){
                        clip_styles.push(getClipStyle(clip))
                    }
                }
            }
            tmp_streamer_clip = {
                streamer: streamer,
                clips: clip_styles
            }
            streamer_clips.push(tmp_streamer_clip)
        }
    }

    // ストリーマーが登録されていない場合
    if (streamers.length==0){
        return <div className="font-bold text-rose-600 text-2xl">ストリーマーを登録してください．</div>
    }

    return(
        <div className="text-left">
            <div className="font-bold">{extractDate(series.date_start)} ~ {extractDate(series.date_end)}</div>
            <div className="w-full m-4 border shadow-xl overflow-hidden p-5">
                <div className="flex flex-nowrap h-[1500px]  overflow-x-scroll overflow-y-scroll relative">
                    <div className="text-right mt-[110px] mr-3">
                            {dates.map((date)=>(
                                numArray(23).map((time, index)=>(
                                    <div key={crypto.randomUUID()}>
                                    {index==0 ? <div className="h-[60px]"><span className="font-bold">{date}</span> </div>:
                                        <div className="h-[60px]">{time}:00</div>
                                    }
                                    </div>
                                ))
                            ))}
                    </div>
                    {type=="video"
                    ?streamer_videos.map((streamer_video) => (
                            <div key={crypto.randomUUID()} style={{height: `${gridHeight}`}}>
                                <div  className="h-[100px] w-[100px] mb-5 rounded-full group top-0 overflow-hidden flex-shrink-0 sticky z-10">
                                    <Image sizes="500px" fill src={streamer_video.streamer.profile_image_url} alt={streamer_video.streamer.profile_image_url}/>
                                </div>
                                <div className={`h-full border border-black border-opacity-30 relative`}>
                                    {gridNum.map(() => (
                                        <div key={crypto.randomUUID()} className="h-[60px] border-b-black border border-opacity-30"></div>
                                    ))}
                                    {streamer_video.videos.map(({ video, video_pos, video_height, view_color }) =>(
                                        <div key={crypto.randomUUID()} onClick={() => onOpen("showVideo", "", { video })} className={`w-[100px] absolute m-auto cursor-pointer p-2 overflow-hidden`} style={{backgroundColor:`${view_color}`, top: `${video_pos}`, height: `${video_height}`}}>
                                            <span className="h-full font-bold whitespace-normal">{video.title}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    :streamer_clips.map((streamer_clip) => (
                        <div key={crypto.randomUUID()} style={{height: `${gridHeight}`}}>
                            <div  className="h-[100px] w-[100px] mb-5 rounded-full group top-0 overflow-hidden flex-shrink-0 sticky z-10">
                                <Image sizes="500px" fill src={streamer_clip.streamer.profile_image_url} alt={streamer_clip.streamer.profile_image_url}/>
                            </div>
                            <div className={`h-full border border-black border-opacity-30 relative`}>
                                {gridNum.map(() => (
                                    <div key={crypto.randomUUID()} className="h-[60px] border-b-black border border-opacity-30"></div>
                                ))}
                                {streamer_clip.clips.map(({ clip, clip_pos, clip_height, view_color }) =>(
                                    <div key={crypto.randomUUID()} onClick={() => onOpen("showClip", "", { clip })} className={`w-[100px] absolute m-auto cursor-pointer p-2 overflow-hidden`} style={{backgroundColor:`${view_color}`, top: `${clip_pos}`, height: `${clip_height}`}}>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                    }   
                </div>
            </div>
        </div>
    )
}