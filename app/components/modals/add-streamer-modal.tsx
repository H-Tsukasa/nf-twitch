"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Image from "next/image";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import { useMemo, useState } from "react";
import apiClient from "@/hooks/api-client";
import { Streamer } from "@/types/streamer";
import { useEffect } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { StreamerCard } from "../streamer/streamer-card";

const formSchema = z.object({
        streamer_uuid: z.string().min(1),
        series_id: z.number().min(1)
    }
).refine(
    (args) => {
        const { streamer_uuid } = args;
        return streamer_uuid != ""
    }
);

export const AddStreamerModal = () => {
  const params = useParams()
  const { isOpen, onClose, type } = useModal();
  const router = useRouter();

  const isModalOpen = isOpen && type === "addStreamer";
  
  // formデータの定義
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
        streamer_uuid: "",
        series_id: Number(params.seriesId)
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await apiClient.post(`/streamer_series/`, values);
      form.reset();
      setSelectedStreamer(undefined)
      onClose();
      router.refresh()
      location.reload()
    } catch (error) {
      console.log(error);
    } finally{

    }
  };

  const handleClose = () => {
    form.reset();
    setSelectedStreamer(undefined)
    onClose();
  };

  // dbから取得したストリーマーの保存
  const [streamers, setStreamers] = useState<Streamer[]>([])
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
      const fetchData = async () => {
              try {
                  const response = await apiClient.get<Streamer[]>(`/streamers/`);
                  setStreamers(response.data);
              } catch (err) {
                  setError("データの取得に失敗しました。");
              }
        };
      fetchData();
  }, []);

  // 選択中のストリーマーを保存
  const [selectedStreamer, setSelectedStreamer] = useState<Streamer>()

  const handleOptionChange = (streamer: Streamer) => {
    setSelectedStreamer(streamer);
  };

  if(error){
    return <p>{error}</p>
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            ストリーマーの追加
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            追加するストリーマーを選択してください
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <FormField
                control={form.control}
                name="streamer_uuid"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                    <ScrollArea className="flex-1 h-[500px]">
                    <RadioGroup 
                      onValueChange={field.onChange}
                      className="flex flex-col space-y-1"
                    >
                    {streamers.map((streamer) => (
                      <div key={String(streamer.id)}>
                        <FormItem>
                          <FormControl>
                            <RadioGroupItem value={streamer.uuid}  />
                          </FormControl>
                          <FormLabel className="font-normal" onClick={() => handleOptionChange(streamer)} >
                            <StreamerCard streamer={streamer} selected_id={selectedStreamer?.id}/>
                          </FormLabel>
                      </FormItem>
                      </div>
                    ))}
                  </RadioGroup>
                  </ScrollArea>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                />
              <div>選択中
                {selectedStreamer && (
                <div className="flex">
                  <div className="h-[60px] w-[60px] rounded-full group relative overflow-hidden">
                    <Image sizes="500px" fill src={selectedStreamer.profile_image_url} alt={selectedStreamer.profile_image_url}/>
                  </div>
                  <div className="font-bold m-auto text-xl overflow-hidden">{selectedStreamer.display_name}</div>
                </div>
                )}
              </div>
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button disabled={isLoading || !selectedStreamer}>
                追加
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
