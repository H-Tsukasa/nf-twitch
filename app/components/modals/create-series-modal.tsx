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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar"
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import { useMemo } from "react";
import apiClient from "@/apiClient";

import { useAuth } from "@/context/auth";
import { User } from "@/types/user";
import { cn } from "@/lib/utils";
import { CalendarDaysIcon } from "lucide-react";

import { format } from "date-fns"
import { useEffect } from "react";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "名前を入力してください",
  }).max(100, {
    message: "100文字以内で入力してください"
  }),
  date_start: z.date().min(new Date("2023-12-01"), {
    message: "2023/12/01以降の日付を選択してください",
  }),
  date_end: z.date().min(new Date("2023-12-01"), {
    message: "2023/12/01以降の日付を選択してください",
  }),
  user_id: z.string(),
  uuid: z.string()
}).refine(
  (args) => {
    const { date_start, date_end } = args;
    // 終了日が開始日より未来かどうか
    return date_end.getTime() >= date_start.getTime();
  },
  {
    message: "終了日は開始日より未来の日付にしてください",
    path: ["date_end"]
  }
);

export const CreateSeriesModal = () => {
  const user = useAuth() as User

  const { isOpen, onClose, type } = useModal();
  const router = useRouter();

  const isModalOpen = isOpen && type === "createSeries";

  const defaultValues = useMemo(() =>{
    return {
        name: "",
        date_start: new Date("2023-12-01"),
        date_end: new Date("2023-12-01"),
        user_id: user?.id,
        uuid: crypto.randomUUID(),
      }
    }, [user])
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues])

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const res = await apiClient.post(`/series`, values);
      console.log(res.data.id)
      form.reset();
      onClose();
      router.refresh()
      router.push(`/series/${res.data.id}`)
    } catch (error) {
      console.log(error);
    } finally{

    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            時系列の作成
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            名前と開始日-終了日を入力してください
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      名前
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="名前を入力してください"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-8 px-6">
              <FormField
                control={form.control}
                name="date_start"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70 mr-4">
                      開始日
                    </FormLabel>
                    <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarDaysIcon className="ml-auto h-4 w-4 opacity-50"></CalendarDaysIcon>
                    </Button>
                  </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-8 px-6">
              <FormField
                control={form.control}
                name="date_end"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70 mr-4">
                      終了日
                    </FormLabel>
                    <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    <CalendarDaysIcon className="ml-auto h-4 w-4 opacity-50"></CalendarDaysIcon>
                    </Button>
                  </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button disabled={isLoading}>
                作成
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
