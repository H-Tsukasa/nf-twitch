"use client";

import axios from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal-store";
import Image from "next/image";


export const ClipModal = () => {

  const { isOpen, onClose, type, data } = useModal();

  const { clip } = data;

  const isModalOpen = isOpen && type === "showClip";

  const handleClose = () => {
    onClose();
  };

  if(!clip){
    return null;
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden w-[1000px] max-w-[2000px] h-[1000px]">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            {clip.title}
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
          </DialogDescription>
          <iframe className="m-auto"
              width="900px"
              height="800px"  
              src={`https://clips.twitch.tv/embed?clip=${clip.clip_number}&parent=localhost`}
              sandbox="allow-scripts allow-same-origin allow-popups"
              title="Twitch Embed">
          </iframe>
        </DialogHeader>
            <DialogFooter className="bg-gray-100 px-6 py-4">
            </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
