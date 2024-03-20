import { Clip } from "@/types/clip";
import { Video } from "@/types/video";
import { create } from "zustand";

export type ModalType =
    | "createSeries"
    | "addStreamer"
    | "showVideo"
    | "showClip";

interface Series{
    id: Number,
    name: String,
    game_id: String,
    date_start: String,
    date_end: String,
}

interface ModalData {
    video?: Video;
    clip?: Clip;
}

interface ModalStore {
    type: ModalType | null;
    series_id: string | null;
    data: ModalData;
    isOpen: boolean;
    onOpen: (type: ModalType, series_id?: string, data?: ModalData) => void;
    onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
    type: null,
    series_id: "",
    data: {},
    isOpen: false,
    onOpen: (type,  series_id = "", data = {}) => set({ isOpen: true, type, data, series_id }),
    onClose: () => set({ type: null, isOpen: false }),
}));
