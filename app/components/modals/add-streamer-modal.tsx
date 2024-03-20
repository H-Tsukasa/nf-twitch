"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "react-query";

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
import { Button } from "@/components/ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { StreamerCard } from "../streamer/streamer-card";

import { useModal } from "@/hooks/use-modal-store";
import apiClient from "@/hooks/api-client";

import { Streamer } from "@/types/streamer";

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
  // const params = useParams()
  const { isOpen, onClose, type, series_id } = useModal();
  const router = useRouter();

  const isModalOpen = isOpen && type === "addStreamer";
  
  // formデータの定義
  const defaultValues = useMemo(() =>{
    return {
      streamer_uuid: "",
      series_id: Number(series_id)
    }
    }, [series_id])
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues])

  // form.setValue("series_id", Number(series_id))

  const isLoading = form.formState.isSubmitting;

  const queryClient = useQueryClient()

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await apiClient.post(`/streamer_series/`, values);
      form.reset();
      setSelectedStreamer(undefined)
      onClose();
      await queryClient.invalidateQueries(["streamers", series_id])
      router.refresh()
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
              <div>
                {selectedStreamer && (
                  <div>選択中
                    <div className="flex">
                      <div className="h-[60px] w-[60px] rounded-full group relative overflow-hidden">
                        <Image sizes="500px" fill src={selectedStreamer.profile_image_url} alt={selectedStreamer.profile_image_url}/>
                      </div>
                      <div className="font-bold m-auto text-xl overflow-hidden">{selectedStreamer.display_name}</div>
                    </div>
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
