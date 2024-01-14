"use client";

import { useEffect, useState } from "react";

import { CreateSeriesModal } from "@/components/modals/create-series-modal";
import { AddStreamerModal } from "@/components/modals/add-streamer-modal";
import { VideoModal } from "@/components/modals/video-modal";
import { ClipModal } from "@/components/modals/clip-modal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <CreateSeriesModal />
      <AddStreamerModal />
      <VideoModal/>
      <ClipModal/>
    </>
  );
};
