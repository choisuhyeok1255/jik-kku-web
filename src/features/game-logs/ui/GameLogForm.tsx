"use client";

import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  CreateGameLogForm,
  UpdateGameLogForm,
  transformFormToApiBody,
} from "@/src/features";
import {
  useGetTeams,
  CreateGameLogQueryModel,
  UpdateGameLogQueryModel,
  useGetStadiums,
  useGetUser,
} from "@/src/entities";
import {
  useUploadFile,
  useGetSignedUrl,
  UploadFileQueryModel,
  cn,
  Notification,
  Calendar,
  Popover,
  PopoverTrigger,
  Button,
  PopoverContent,
  FileDropzone,
  LabelContent,
  Spinner,
  compressImage,
} from "@/src/shared";
import GameLogStadiumModal from "./GameLogStadiumModal";
import GameLogTeamModal from "./GameLogTeamModal";

const GameLogForm = ({
  defaultValues,
  handleClickSubmit,
}: {
  defaultValues?: CreateGameLogForm | UpdateGameLogForm;
  handleClickSubmit: (
    body: CreateGameLogQueryModel["body"] | UpdateGameLogQueryModel["body"],
  ) => void;
}) => {
  const { data: user } = useGetUser();
  const { data: teams } = useGetTeams();
  const { data: stadiums } = useGetStadiums();
  const { mutateAsync: uploadFile } = useUploadFile();
  const { mutateAsync: getSignedUrl } = useGetSignedUrl();

  const [initImageUrl, setInitImageUrl] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  const { control, setValue, register, reset, watch, handleSubmit } = useForm<
    CreateGameLogForm | UpdateGameLogForm
  >({ mode: "all", shouldFocusError: false });

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isHomeTeamModalOpen, setIsHomeTeamModalOpen] = useState(false);
  const [isAwayTeamModalOpen, setIsAwayTeamModalOpen] = useState(false);
  const [isStadiumModalOpen, setIsStadiumModalOpen] = useState(false);

  const handleCreateGameLog = async (
    formData: CreateGameLogForm | UpdateGameLogForm,
  ) => {
    if (!user?.id) {
      toast.error("로그인 후 이용해 주세요!");
      return;
    }

    const imageFile = formData.gameLogImage?.[0];
    const hasImage = imageFile && imageFile instanceof File;

    if (hasImage) {
      const originalFile: UploadFileQueryModel = {
        bucket: "game-log-images",
        file: imageFile,
        userId: user.id,
      };
      const thumbnailFile: UploadFileQueryModel = {
        bucket: "game-log-images-thumbnail",
        file: await compressImage(imageFile),
        userId: user.id,
      };
      const originalFileResult = await uploadFile(originalFile);
      const thumbnailFileResult = await uploadFile(thumbnailFile);

      handleClickSubmit(
        transformFormToApiBody({
          userId: user.id,
          formData,
          gameLogImage: originalFileResult.path,
          gameLogImageThumbnail: thumbnailFileResult.path,
          isCertified: true,
          isAdminCertified: false,
        }),
      );
    } else {
      handleClickSubmit(
        transformFormToApiBody({
          userId: user.id,
          formData,
          isCertified: false,
          isAdminCertified: false,
        }),
      );
    }
  };

  const handleEditGameLog = async (
    formData: CreateGameLogForm | UpdateGameLogForm,
  ) => {
    const userId = user?.id;
    if (!userId) {
      toast.error("로그인 후 이용해 주세요!");
      return;
    }

    // NOTE: 사진 그대로 유지
    if (formData.gameLogImage && typeof formData.gameLogImage === "string") {
      handleClickSubmit(transformFormToApiBody({ userId, formData }));
    }

    // NOTE: 사진 삭제
    if (formData.gameLogImage === null) {
      handleClickSubmit(
        transformFormToApiBody({
          userId,
          formData,
          gameLogImage: null,
          gameLogImageThumbnail: null,
          isCertified: false,
          isAdminCertified: false,
        }),
      );
    }

    // NOTE: 사진 변경
    if (
      formData.gameLogImage &&
      formData.gameLogImage?.[0] instanceof File &&
      typeof formData.gameLogImage !== "string"
    ) {
      const imageFile = formData.gameLogImage[0];

      const originalFile: UploadFileQueryModel = {
        bucket: "game-log-images",
        file: imageFile,
        userId,
      };
      const thumbnailFile: UploadFileQueryModel = {
        bucket: "game-log-images-thumbnail",
        file: await compressImage(imageFile),
        userId,
      };
      const originalFileResult = await uploadFile(originalFile);
      const thumbnailFileResult = await uploadFile(thumbnailFile);

      handleClickSubmit(
        transformFormToApiBody({
          userId,
          formData,
          gameLogImage: originalFileResult.path,
          gameLogImageThumbnail: thumbnailFileResult.path,
          isCertified: true,
          isAdminCertified: false,
        }),
      );
    }
  };

  useEffect(() => {
    if (!user || defaultValues || !stadiums) return;

    reset({
      homeTeamId: user.team_id,
      awayTeamId: null,
      homeTeamScore: null,
      awayTeamScore: null,
      matchDate: dayjs().format("YYYY-MM-DD"),
      stadiumId:
        teams?.find((team) => team.id === user.team_id)?.stadium_id ?? null,
      note: "",
      gameLogImage: null,
    });
  }, [user, stadiums, teams, defaultValues, reset]);

  useEffect(() => {
    if (!defaultValues) return;

    reset({
      homeTeamId: defaultValues.homeTeamId,
      awayTeamId: defaultValues.awayTeamId,
      homeTeamScore: defaultValues.homeTeamScore,
      awayTeamScore: defaultValues.awayTeamScore,
      matchDate: defaultValues.matchDate,
      stadiumId: defaultValues.stadiumId,
      note: defaultValues.note,
      gameLogImage: defaultValues.gameLogImage,
    });
  }, [defaultValues, reset]);

  useEffect(() => {
    if (
      defaultValues?.gameLogImage &&
      typeof defaultValues.gameLogImage === "string"
    ) {
      getSignedUrl({
        bucket: "game-log-images-thumbnail",
        path: defaultValues.gameLogImage,
      })
        .then((data) => setInitImageUrl(data.signedUrl))
        .catch(() => setInitImageUrl(null));
    } else {
      setInitImageUrl(null);
    }
  }, [defaultValues?.gameLogImage, getSignedUrl]);

  return (
    <form
      className="px-[16px] py-[20px]"
      onSubmit={handleSubmit(
        async (formData) => {
          setIsSending(true);

          if (defaultValues) {
            handleEditGameLog(formData);
          } else {
            handleCreateGameLog(formData);
          }
        },
        (error) => {
          const errors = Object.values(error);
          const errorMessage =
            errors.length === 1 ? errors[0]?.message : "필수 입력 해주세요!";

          toast.error(errorMessage);
          setIsSending(false);
        },
      )}
    >
      <div className="flex flex-col gap-[40px]">
        <div className="flex flex-col gap-[16px]">
          <LabelContent label="날짜" isRequired>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  className="h-[48px] w-full justify-start rounded-[20px] border border-white/10 bg-[#ffffff]/4"
                  variant="outline"
                >
                  {watch("matchDate") ? (
                    watch("matchDate")
                  ) : (
                    <span className="text-[14px] text-white/60">날짜 선택</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto border border-white/10 bg-[#171717] p-0">
                <Controller
                  control={control}
                  name="matchDate"
                  rules={{ required: "날짜를 선택해주세요!" }}
                  render={({ field: { value, onChange } }) => (
                    <Calendar
                      classNames={{ root: "bg-white" }}
                      mode="single"
                      selected={dayjs(value)?.toDate()}
                      formatters={{
                        formatCaption: (date) => {
                          const year = date.getFullYear();
                          const month = date.getMonth() + 1;
                          return `${year}년 ${month}월`;
                        },
                      }}
                      onSelect={(date) => {
                        onChange(dayjs(date).format("YYYY-MM-DD"));
                        setIsCalendarOpen(false);
                      }}
                    />
                  )}
                />
              </PopoverContent>
            </Popover>
          </LabelContent>
          <LabelContent label="경기장" isRequired>
            <Controller
              control={control}
              name="stadiumId"
              rules={{ required: "경기장을 선택해주세요!" }}
              render={({ field: { value } }) => (
                <button
                  className={cn(
                    "flex h-[48px] w-full items-center rounded-[20px] border border-white/10 bg-[#ffffff]/4 p-[14px] text-start text-[14px]",
                    !value && "text-[#ffffff]/60",
                  )}
                  type="button"
                  onClick={() => setIsStadiumModalOpen(true)}
                >
                  {value
                    ? stadiums?.find((stadium) => stadium.id === value)?.name
                    : "경기장 선택"}
                </button>
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
          <div className="flex flex-col gap-[16px]">
            <div className="flex justify-between gap-[16px]">
              <LabelContent className="flex-1" label="응원팀" isRequired>
                <Controller
                  control={control}
                  name="homeTeamId"
                  rules={{ required: "응원팀을 선택해주세요!" }}
                  render={({ field: { value } }) => (
                    <button
                      className={cn(
                        "flex h-[48px] w-full items-center rounded-[20px] border border-white/10 bg-[#ffffff]/4 p-[14px] text-start text-[14px]",
                        !value && "text-[#ffffff]/60",
                      )}
                      type="button"
                      onClick={() => setIsHomeTeamModalOpen(true)}
                    >
                      {value
                        ? teams?.find((team) => team.id === value)?.team_name
                        : "팀 선택"}
                    </button>
                  )}
                />
                {isHomeTeamModalOpen && (
                  <GameLogTeamModal
                    initSelectedTeamId={{
                      homeTeamId: watch("homeTeamId"),
                      awayTeamId: watch("awayTeamId"),
                    }}
                    initCurrentTab="homeTeam"
                    handleClickTeam={({ homeTeamId, awayTeamId }) => {
                      setValue("homeTeamId", homeTeamId, {
                        shouldDirty: !!homeTeamId,
                        shouldValidate: !!homeTeamId,
                      });
                      setValue("awayTeamId", awayTeamId, {
                        shouldDirty: !!awayTeamId,
                        shouldValidate: !!awayTeamId,
                      });
                    }}
                    handleCloseModal={() => setIsHomeTeamModalOpen(false)}
                  />
                )}
              </LabelContent>
              <LabelContent className="flex-1" label="상대팀" isRequired>
                <Controller
                  control={control}
                  name="awayTeamId"
                  rules={{ required: "상대팀을 선택해주세요!" }}
                  render={({ field: { value } }) => (
                    <button
                      className={cn(
                        "flex h-[48px] w-full items-center rounded-[20px] border border-white/10 bg-[#ffffff]/4 p-[14px] text-start text-[14px]",
                        !value && "text-[#ffffff]/60",
                      )}
                      type="button"
                      onClick={() => setIsAwayTeamModalOpen(true)}
                    >
                      {value
                        ? teams?.find((team) => team.id === value)?.team_name
                        : "팀 선택"}
                    </button>
                  )}
                />
                {isAwayTeamModalOpen && (
                  <GameLogTeamModal
                    initSelectedTeamId={{
                      homeTeamId: watch("homeTeamId"),
                      awayTeamId: watch("awayTeamId"),
                    }}
                    initCurrentTab="awayTeam"
                    handleClickTeam={({ homeTeamId, awayTeamId }) => {
                      setValue("homeTeamId", homeTeamId, {
                        shouldDirty: !!homeTeamId,
                        shouldValidate: !!homeTeamId,
                      });
                      setValue("awayTeamId", awayTeamId, {
                        shouldDirty: !!awayTeamId,
                        shouldValidate: !!awayTeamId,
                      });
                    }}
                    handleCloseModal={() => setIsAwayTeamModalOpen(false)}
                  />
                )}
              </LabelContent>
            </div>
            <div className="flex gap-[16px]">
              <LabelContent className="flex-1" label="응원팀 점수" isRequired>
                <div className="flex h-[48px] w-full items-center rounded-[20px] border border-white/10 bg-[#ffffff]/4 px-[14px]">
                  <input
                    className="min-w-0 flex-1 [appearance:textfield] bg-transparent [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    min={0}
                    max={50}
                    step={1}
                    type="number"
                    placeholder="0"
                    onKeyDown={(e) =>
                      [".", ",", "e", "E", "+", "-"].includes(e.key) &&
                      e.preventDefault()
                    }
                    {...register("homeTeamScore", {
                      required: "응원팀 점수를 입력해주세요!",
                      setValueAs: (v) => {
                        const n = Math.floor(Number(v));
                        return Number.isNaN(n)
                          ? undefined
                          : Math.min(50, Math.max(0, n));
                      },
                    })}
                  />
                  <span className="shrink-0 pl-[4px] text-[14px] text-white/60">
                    점
                  </span>
                </div>
              </LabelContent>
              <LabelContent className="flex-1" label="상대팀 점수" isRequired>
                <div className="flex h-[48px] w-full items-center rounded-[20px] border border-white/10 bg-[#ffffff]/4 px-[14px]">
                  <input
                    className="min-w-0 flex-1 [appearance:textfield] bg-transparent [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    min={0}
                    max={50}
                    step={1}
                    type="number"
                    placeholder="0"
                    onKeyDown={(e) =>
                      [".", ",", "e", "E", "+", "-"].includes(e.key) &&
                      e.preventDefault()
                    }
                    {...register("awayTeamScore", {
                      required: "상대팀 점수를 입력해주세요!",
                      setValueAs: (v) => {
                        const n = Math.floor(Number(v));
                        return Number.isNaN(n)
                          ? undefined
                          : Math.min(50, Math.max(0, n));
                      },
                    })}
                  />
                  <span className="shrink-0 pl-[4px] text-[14px] text-white/60">
                    점
                  </span>
                </div>
              </LabelContent>
            </div>
            <LabelContent label="메모">
              <textarea
                className="w-full resize-none justify-start rounded-[20px] border border-white/10 bg-[#ffffff]/4 px-[12px] py-[8px]"
                rows={2}
                maxLength={200}
                placeholder="오늘 경기는 어땠나요? 자유롭게 기록해보세요 ✨"
                {...register("note", { maxLength: 200 })}
              />
            </LabelContent>
            <LabelContent label="사진">
              <Notification
                className="mb-[4px]"
                text="사진을 추가하면 랭킹에 바로 반영돼요. 경기와 무관한 사진은 추후 인증이 취소될 수 있어요 ✨"
              />
              <Controller
                control={control}
                name="gameLogImage"
                render={({ field: { value, onChange } }) => (
                  <FileDropzone
                    className="h-[144px]"
                    initImageUrl={
                      typeof value === "string" ? initImageUrl : undefined
                    }
                    onChange={(files) => onChange(files)}
                  />
                )}
              />
            </LabelContent>
          </div>
        </div>
        <div className="flex justify-center gap-8">
          <button
            className="flex h-[56px] w-full items-center justify-center rounded-[20px] bg-[#5724F0] text-[16px] disabled:opacity-50"
            disabled={isSending}
          >
            {isSending ? (
              <Spinner className="size-5 text-white" />
            ) : defaultValues ? (
              "수정완료"
            ) : (
              "직관 등록하기"
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default GameLogForm;
