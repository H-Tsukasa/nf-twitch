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
    data: ModalData;
    isOpen: boolean;
    onOpen: (type: ModalType, data?: ModalData) => void;
    onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
    type: null,
    data: {},
    isOpen: false,
    onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
    onClose: () => set({ type: null, isOpen: false }),
}));
