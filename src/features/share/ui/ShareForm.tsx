"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { cn, DateTimePicker, LabelContent } from "@/src/shared";
import { useGetStadiums, useAuthStore } from "@/src/entities";
import { GameLogStadiumModal } from "@/src/features";
import type { CreateShareForm } from "../model/types/form";

const ShareForm = ({
  defaultValues,
  handleClickSubmit,
}: {
  defaultValues?: CreateShareForm;
  handleClickSubmit: (body: {
    title: string;
    content: string | null;
    deadline: string;
    stadium_id: number | null;
    max_attendees: number;
  }) => void;
}) => {
  const { user } = useAuthStore();
  const { data: stadiums } = useGetStadiums();

  const { control, setValue, register, watch, handleSubmit, reset, formState } =
    useForm<CreateShareForm>({
      defaultValues: {
        title: "",
        content: "",
        deadline: null,
        stadiumId: null,
        maxAttendees: 1,
      },
      mode: "all",
      shouldFocusError: false,
    });

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  const [isStadiumModalOpen, setIsStadiumModalOpen] = useState(false);

  return (
    <form
      className="flex min-h-0 flex-1 flex-col"
      onSubmit={handleSubmit(
        (formData) => {
          if (!user?.id) return;

          handleClickSubmit({
            title: formData.title,
            content: formData.content || null,
            deadline: formData.deadline!.toISOString(),
            stadium_id: formData.stadiumId,
            max_attendees: formData.maxAttendees,
          });
        },
        () => {
          alert("모든 필수 항목을 입력해 주세요!");
        },
      )}
    >
      <div className="flex-1 overflow-y-auto px-[16px] py-[20px]">
        <div className="flex flex-col gap-[40px]">
          <div className="flex flex-col gap-[16px]">
          <LabelContent label="제목" isRequired>
            <input
              className="h-[48px] w-full rounded-[20px] border border-white/10 bg-[#ffffff]/4 px-[12px] py-[8px] text-white placeholder:text-white/60"
              placeholder="나눔 제목을 입력해 주세요"
              maxLength={100}
              {...register("title", { required: true, maxLength: 100 })}
            />
          </LabelContent>
          <LabelContent label="마감일" isRequired>
            <Controller
              control={control}
              name="deadline"
              rules={{
                required: "마감일을 선택해 주세요",
                validate: (value) => {
                  if (!value) return true;
                  return value > new Date()
                    ? true
                    : "마감일은 현재 시간보다 이후로 설정해 주세요";
                },
              }}
              render={({ field: { value, onChange }, fieldState: { error } }) => (
                <div className="flex flex-col gap-[8px]">
                  <DateTimePicker
                    value={value ?? undefined}
                    onChange={(date) => onChange(date ?? null)}
                    placeholder="마감일과 시간 선택"
                  />
                  {error && (
                    <span className="text-[14px] text-red-500">
                      {error.message}
                    </span>
                  )}
                </div>
              )}
            />
          </LabelContent>
          <LabelContent label="나눔 인원" isRequired>
            <input
              type="number"
              min={1}
              max={99}
              placeholder="몇 명까지 나눔할지 입력"
              className="h-[48px] w-full rounded-[20px] border border-white/10 bg-[#ffffff]/4 px-[12px] py-[8px] text-white placeholder:text-white/60 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              {...register("maxAttendees", {
                required: true,
                min: 1,
                max: 99,
                setValueAs: (v) => {
                  const n = Number(v);
                  if (Number.isNaN(n) || n < 1) return 1;
                  if (n > 99) return 99;
                  return Math.floor(n);
                },
              })}
            />
          </LabelContent>
          <LabelContent label="경기장" isRequired>
            <Controller
              control={control}
              name="stadiumId"
              rules={{ required: "경기장을 선택해 주세요" }}
              render={({ field: { value, onChange }, fieldState: { error } }) => (
                <div className="flex flex-col gap-[8px]">
                  <button
                    className={cn(
                      "flex h-[48px] w-full items-center rounded-[20px] border border-white/10 bg-[#ffffff]/4 p-[14px] text-start text-[14px]",
                      !value && "text-white/60",
                    )}
                    type="button"
                    onClick={() => setIsStadiumModalOpen(true)}
                  >
                    {value
                      ? stadiums?.find((stadium) => stadium.id === value)?.name
                      : "경기장 선택"}
                </button>
                  {error && (
                    <span className="text-[14px] text-red-500">
                      {error.message}
                    </span>
                  )}
                </div>
              )}
            />
            {isStadiumModalOpen && (
              <GameLogStadiumModal
                initSelectedStadiumId={watch("stadiumId")}
                handleClickStadium={(stadiumId) => {
                  setValue("stadiumId", stadiumId, {
                    shouldDirty: !!stadiumId,
                    shouldValidate: !!stadiumId,
                  });
                }}
                handleCloseModal={() => setIsStadiumModalOpen(false)}
              />
            )}
          </LabelContent>
          <LabelContent label="내용" isRequired>
            <div className="flex flex-col gap-[8px]">
              <textarea
                className="w-full resize-none rounded-[20px] border border-white/10 bg-[#ffffff]/4 px-[12px] py-[8px] text-white placeholder:text-white/60"
                rows={4}
                maxLength={500}
                placeholder="나눔 내용을 자유롭게 작성해 주세요 (최대 500자)"
                {...register("content", {
                  required: "내용을 입력해 주세요",
                  maxLength: 500,
                })}
              />
              {formState.errors.content && (
                <span className="text-[14px] text-red-500">
                  {formState.errors.content.message}
                </span>
              )}
            </div>
          </LabelContent>
          </div>
        </div>
      </div>
      <div className="shrink-0 px-[16px] pb-[20px]">
        <button
          className="h-[56px] w-full rounded-[20px] bg-[#5724F0] text-[16px]"
          type="submit"
        >
          {defaultValues ? "수정완료" : "나눔 등록하기"}
        </button>
      </div>
    </form>
  );
};

export default ShareForm;
