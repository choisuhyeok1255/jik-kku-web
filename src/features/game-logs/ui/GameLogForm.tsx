import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import dayjs from "dayjs";

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
} from "@/src/shared";
import { toast } from "sonner";
import {
  useGetTeams,
  useAuthStore,
  CreateGameLogQueryModel,
  UpdateGameLogQueryModel,
  useGetStadiums,
} from "@/src/entities";
import {
  CreateGameLogForm,
  UpdateGameLogForm,
  transformFormToApiBody,
} from "@/src/features";
import GameLogTeamModal from "./GameLogTeamModal";
import GameLogStadiumModal from "./GameLogStadiumModal";

const GameLogForm = ({
  defaultValues,
  handleClickSubmit,
}: {
  defaultValues?: CreateGameLogForm | UpdateGameLogForm;
  handleClickSubmit: (
    body: CreateGameLogQueryModel["body"] | UpdateGameLogQueryModel["body"],
  ) => void;
}) => {
  const { user } = useAuthStore();

  const { data: teams } = useGetTeams();
  const { data: stadiums } = useGetStadiums();
  const { mutateAsync: uploadFile } = useUploadFile();
  const { mutateAsync: getSignedUrl } = useGetSignedUrl();
  const [initImageUrl, setInitImageUrl] = useState<string | null>(null);

  const { control, setValue, register, reset, watch, handleSubmit } = useForm<
    CreateGameLogForm | UpdateGameLogForm
  >({
    defaultValues: {
      homeTeamId: null,
      awayTeamId: null,
      homeTeamScore: null,
      awayTeamScore: null,
      matchDate: dayjs().format("YYYY-MM-DD"),
      stadiumId: null,
      companion: "",
      mvp: "",
      note: "",
      weather: null,
      gameLogImage: null,
    },
    mode: "all",
    shouldFocusError: false,
  });

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isHomeTeamModalOpen, setIsHomeTeamModalOpen] = useState(false);
  const [isAwayTeamModalOpen, setIsAwayTeamModalOpen] = useState(false);
  const [isStadiumModalOpen, setIsStadiumModalOpen] = useState(false);

  useEffect(() => {
    if (!defaultValues) return;

    reset({
      homeTeamId: defaultValues.homeTeamId,
      awayTeamId: defaultValues.awayTeamId,
      homeTeamScore: defaultValues.homeTeamScore,
      awayTeamScore: defaultValues.awayTeamScore,
      matchDate: defaultValues.matchDate,
      stadiumId: defaultValues.stadiumId,
      companion: defaultValues.companion,
      mvp: defaultValues.mvp,
      note: defaultValues.note,
      weather: defaultValues.weather,
      gameLogImage: defaultValues.gameLogImage,
    });
  }, [defaultValues, reset]);

  useEffect(() => {
    if (
      defaultValues?.gameLogImage &&
      typeof defaultValues.gameLogImage === "string"
    ) {
      getSignedUrl({
        bucket: "game-log-images",
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
          if (!user?.id) return;

          let imagePath: string | null;
          if (
            formData.gameLogImage &&
            formData.gameLogImage instanceof FileList
          ) {
            const file: UploadFileQueryModel = {
              bucket: "game-log-images",
              file: formData.gameLogImage[0],
              userId: user.id,
            };
            const result = await uploadFile(file);
            imagePath = result.path;
          } else {
            imagePath =
              typeof formData.gameLogImage === "string"
                ? formData.gameLogImage
                : null;
          }

          handleClickSubmit(
            transformFormToApiBody(user.id, formData, imagePath),
          );
        },
        () => {
          toast.error("필수 입력 해주세요!");
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
                  rules={{ required: true }}
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
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
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
                  rules={{ required: true }}
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
                  rules={{ required: true }}
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
                <input
                  className="h-[48px] w-full justify-start rounded-[20px] border border-white/10 bg-[#ffffff]/4 px-[12px] py-[8px]"
                  min={0}
                  max={50}
                  {...register("homeTeamScore", { required: true })}
                />
              </LabelContent>
              <LabelContent className="flex-1" label="상대팀 점수" isRequired>
                <input
                  className="h-[48px] w-full justify-start rounded-[20px] border border-white/10 bg-[#ffffff]/4 px-[12px] py-[8px]"
                  min={0}
                  max={50}
                  {...register("awayTeamScore", { required: true })}
                />
              </LabelContent>
            </div>
            <LabelContent label="메모">
              <textarea
                className="w-full resize-none justify-start rounded-[20px] border border-white/10 bg-[#ffffff]/4 px-[12px] py-[8px]"
                rows={2}
                maxLength={200}
                placeholder="오늘 경기는 어땠나요? 자유롭게 기록해보세요 ✨ (최대 200자)"
                {...register("note", { maxLength: 200 })}
              />
            </LabelContent>
            <LabelContent label="사진">
              <Notification
                className="mb-[4px]"
                text="직관을 인증할 수 있는 사진을 추가해 주세요. 티켓이 함께 보이는 사진이 가장 좋아요!  😊"
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
          <button className="h-[56px] w-full rounded-[20px] bg-[#5724F0] text-[16px]">
            {defaultValues ? "수정완료" : "직관 등록하기"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default GameLogForm;
