"use client";

import dayjs from "dayjs";
import { ChevronLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Control,
  Controller,
  useForm,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
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
  useGetKboEventsByDay,
} from "@/src/entities";
import type { KboEventRow } from "@/src/entities";
import {
  useUploadFile,
  useGetSignedUrl,
  UploadFileQueryModel,
  cn,
  Calendar,
  FileDropzone,
  LabelContent,
  Spinner,
  compressImage,
  Header,
} from "@/src/shared";
import { findTeamIdByKboName } from "../lib/kboTeamMapping";
import GameLogStadiumModal from "./GameLogStadiumModal";
import GameLogTeamModal from "./GameLogTeamModal";

const CreateModeFormStep1 = ({
  control,
  matchDate,
  kboEvents,
  isLoading,
  selectedEvent,
  isCalendarMounted,
  getDisplayNames,
  handleDateChange,
  handleSelectEvent,
}: {
  control: Control<CreateGameLogForm | UpdateGameLogForm>;
  matchDate: string | null | undefined;
  kboEvents: KboEventRow[];
  isLoading: boolean;
  selectedEvent: KboEventRow | null;
  isCalendarMounted: boolean;
  getDisplayNames: (event: KboEventRow) => {
    homeTeamName: string;
    awayTeamName: string;
    stadiumName: string;
  };
  handleDateChange: () => void;
  handleSelectEvent: (event: KboEventRow) => void;
  handleClickMainButton: () => void;

  isMainButtonEnabled: boolean;
}) => {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-[16px]">
      <div className="shrink-0">
        <Controller
          control={control}
          name="matchDate"
          rules={{ required: "날짜를 선택해주세요!" }}
          render={({ field: { value, onChange } }) => {
            return isCalendarMounted ? (
              <Calendar
                value={value}
                onChange={(date) => {
                  handleDateChange();
                  if (date === null) {
                    onChange(null);
                  } else {
                    const dateObj = Array.isArray(date) ? date[0] : date;
                    onChange(
                      dateObj ? dayjs(dateObj).format("YYYY-MM-DD") : null,
                    );
                  }
                }}
              />
            ) : (
              <></>
            );
          }}
        />
      </div>
      {matchDate && (
        <div className="min-h-0 flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex min-h-full items-center justify-center">
              <Spinner className="size-8 text-white" />
            </div>
          ) : !kboEvents.length ? (
            <div className="flex min-h-full items-center justify-center">
              <span className="text-[14px] text-white/60">
                해당 날짜에 경기가 없어요
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-[12px]">
              {kboEvents.map((event) => {
                const isSelected = selectedEvent?.idEvent === event.idEvent;
                const { homeTeamName, awayTeamName, stadiumName } =
                  getDisplayNames(event);
                const short = (n: string) => n?.split(" ")[0] ?? n ?? "";
                return (
                  <button
                    key={event.idEvent}
                    className={cn(
                      "flex flex-col gap-[4px] rounded-[20px] border p-[12px] text-left",
                      isSelected
                        ? "border-[#5724F0] bg-[#5724F0]/4"
                        : "border-white/10 bg-white/4",
                    )}
                    type="button"
                    onClick={() => handleSelectEvent(event)}
                  >
                    <div className="text-[14px] font-bold text-white">
                      {short(homeTeamName)} vs {short(awayTeamName)}
                    </div>
                    <div className="text-[12px] text-white/80">
                      {event.strStatus === "FT"
                        ? `${event.intHomeScore} : ${event.intAwayScore}`
                        : event.strStatus === "POST"
                          ? "경기 취소"
                          : "경기 예정"}
                    </div>
                    <div className="text-[12px] text-white/60">
                      {stadiumName}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const CreateModeFormStep2 = ({
  control,
  register,
  watch,
  setValue,
  teams,
  stadiums,
  initImageUrl,
  isFieldsLocked,
  setIsStadiumModalOpen,
  setIsHomeTeamModalOpen,
  setIsAwayTeamModalOpen,
  isStadiumModalOpen,
  isHomeTeamModalOpen,
  isAwayTeamModalOpen,
}: {
  control: Control<CreateGameLogForm | UpdateGameLogForm>;
  register: UseFormRegister<CreateGameLogForm | UpdateGameLogForm>;
  watch: UseFormWatch<CreateGameLogForm | UpdateGameLogForm>;
  setValue: UseFormSetValue<CreateGameLogForm | UpdateGameLogForm>;
  teams: { id: number; team_name: string | null }[];
  stadiums: { id: number; name: string | null }[];
  initImageUrl: string | null;
  isFieldsLocked: boolean;
  setIsStadiumModalOpen: (v: boolean) => void;
  setIsHomeTeamModalOpen: (v: boolean) => void;
  setIsAwayTeamModalOpen: (v: boolean) => void;
  isStadiumModalOpen: boolean;
  isHomeTeamModalOpen: boolean;
  isAwayTeamModalOpen: boolean;
}) => {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="flex flex-col gap-[16px]">
          <div className="flex gap-[16px]">
            <LabelContent className="flex-1" label="날짜" isRequired>
              <>
                <div
                  className={cn(
                    "flex h-[48px] w-full items-center rounded-[20px] border border-white/10 bg-[#ffffff]/4 px-[14px] text-[14px]",
                    isFieldsLocked && "cursor-not-allowed opacity-50",
                  )}
                >
                  {watch("matchDate") ?? (
                    <span className="text-white/60">날짜 선택</span>
                  )}
                </div>
              </>
            </LabelContent>
            <LabelContent className="flex-1" label="경기장" isRequired>
              <Controller
                control={control}
                name="stadiumId"
                rules={{ required: "경기장을 선택해주세요!" }}
                render={({ field: { value } }) => (
                  <button
                    className={cn(
                      "flex h-[48px] w-full items-center rounded-[20px] border border-white/10 bg-[#ffffff]/4 p-[14px] text-start text-[14px] disabled:cursor-not-allowed disabled:opacity-50",
                      !value && "text-[#ffffff]/60",
                    )}
                    type="button"
                    disabled={isFieldsLocked}
                    onClick={() => setIsStadiumModalOpen(true)}
                  >
                    {value
                      ? stadiums?.find((s) => s.id === value)?.name
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
          </div>
          <div className="flex justify-between gap-[16px]">
            <LabelContent className="flex-1" label="응원팀" isRequired>
              <Controller
                control={control}
                name="homeTeamId"
                rules={{ required: "응원팀을 선택해주세요!" }}
                render={({ field: { value } }) => (
                  <button
                    className={cn(
                      "flex h-[48px] w-full items-center rounded-[20px] border border-white/10 bg-[#ffffff]/4 p-[14px] text-start text-[14px] disabled:cursor-not-allowed disabled:opacity-50",
                      !value && "text-[#ffffff]/60",
                    )}
                    type="button"
                    disabled={isFieldsLocked}
                    onClick={() => setIsHomeTeamModalOpen(true)}
                  >
                    {value
                      ? teams?.find((t) => t.id === value)?.team_name
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
                      "flex h-[48px] w-full items-center rounded-[20px] border border-white/10 bg-[#ffffff]/4 p-[14px] text-start text-[14px] disabled:cursor-not-allowed disabled:opacity-50",
                      !value && "text-[#ffffff]/60",
                    )}
                    type="button"
                    disabled={isFieldsLocked}
                    onClick={() => setIsAwayTeamModalOpen(true)}
                  >
                    {value
                      ? teams?.find((t) => t.id === value)?.team_name
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
              <div
                className={cn(
                  "flex h-[48px] w-full items-center rounded-[20px] border border-white/10 bg-[#ffffff]/4 px-[14px]",
                  isFieldsLocked && "has-disabled:opacity-50",
                )}
              >
                <input
                  className="min-w-0 flex-1 [appearance:textfield] bg-transparent disabled:cursor-not-allowed [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  min={0}
                  max={50}
                  type="number"
                  placeholder="0"
                  disabled={isFieldsLocked}
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
                <span className="text-[14px] text-white/60">점</span>
              </div>
            </LabelContent>
            <LabelContent className="flex-1" label="상대팀 점수" isRequired>
              <div
                className={cn(
                  "flex h-[48px] w-full items-center rounded-[20px] border border-white/10 bg-[#ffffff]/4 px-[14px]",
                  isFieldsLocked && "has-disabled:opacity-50",
                )}
              >
                <input
                  className="min-w-0 flex-1 [appearance:textfield] bg-transparent disabled:cursor-not-allowed [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  min={0}
                  max={50}
                  type="number"
                  placeholder="0"
                  disabled={isFieldsLocked}
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
                <span className="text-[14px] text-white/60">점</span>
              </div>
            </LabelContent>
          </div>
          <LabelContent label="메모">
            <textarea
              className="w-full resize-none rounded-[20px] border border-white/10 bg-[#ffffff]/4 px-[12px] py-[8px]"
              rows={2}
              maxLength={200}
              placeholder="오늘 경기는 어땠나요?"
              {...register("note", { maxLength: 200 })}
            />
          </LabelContent>
          <LabelContent label="사진">
            <Controller
              control={control}
              name="gameLogImage"
              render={({ field: { value, onChange } }) => (
                <FileDropzone
                  className="h-[144px]"
                  initImageUrl={
                    typeof value === "string" ? initImageUrl : undefined
                  }
                  placeholder={
                    <span>
                      사진을 추가하면 랭킹에 바로 반영돼요.
                      <br /> 경기와 무관한 사진은 추후 인증이 취소될 수 있어요
                    </span>
                  }
                  onChange={(files) => onChange(files)}
                />
              )}
            />
          </LabelContent>
        </div>
      </div>
    </div>
  );
};

const GameLogForm = ({
  defaultValues,
  handleClickSubmit,
}: {
  defaultValues?: CreateGameLogForm | UpdateGameLogForm;
  handleClickSubmit:
    | ((body: CreateGameLogQueryModel["body"]) => void)
    | ((body: UpdateGameLogQueryModel["body"]) => void);
}) => {
  const router = useRouter();

  const { data: user } = useGetUser();
  const { data: teams } = useGetTeams();
  const { data: stadiums } = useGetStadiums();
  const { mutateAsync: uploadFile } = useUploadFile();
  const { mutateAsync: getSignedUrl } = useGetSignedUrl();

  const [initImageUrl, setInitImageUrl] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  const { control, setValue, register, reset, watch, handleSubmit } = useForm<
    CreateGameLogForm | UpdateGameLogForm
  >({
    mode: "all",
    shouldFocusError: false,
    defaultValues: defaultValues ?? undefined,
  });

  const matchDate = watch("matchDate");

  const [step, setStep] = useState<1 | 2>(defaultValues ? 2 : 1);
  const [inputMode, setInputMode] = useState<"search" | "manual" | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<KboEventRow | null>(null);

  const [isHomeTeamModalOpen, setIsHomeTeamModalOpen] = useState(false);
  const [isAwayTeamModalOpen, setIsAwayTeamModalOpen] = useState(false);
  const [isStadiumModalOpen, setIsStadiumModalOpen] = useState(false);
  const [isCalendarMounted, setIsCalendarMounted] = useState(false);

  useEffect(() => {
    setIsCalendarMounted(true);
  }, []);

  const kboQueryDate = matchDate && step === 1 ? matchDate : "";
  const { data: kboEvents, isLoading } = useGetKboEventsByDay({
    day: kboQueryDate,
  });

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

    if (formData.gameLogImage && typeof formData.gameLogImage === "string") {
      handleClickSubmit(transformFormToApiBody({ userId, formData }));
    }

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
      youtubeUrl: null,
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
      youtubeUrl: defaultValues.youtubeUrl,
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

  // useEffect(() => {
  //  데이터 추가용
  //   if (!kboQueryDate || !kboEvents) return;
  //   if (kboEvents.length === 0) return;

  //   console.log("추가");
  //   addKboEvent({ body: { id: kboQueryDate, data: kboEvents } });
  // }, [kboQueryDate, kboEvents, addKboEvent]);

  const applyEventToForm = (event: KboEventRow) => {
    if (!teams) return;

    const eventHomeTeamId = findTeamIdByKboName(event.strHomeTeam, teams);
    const eventAwayTeamId = findTeamIdByKboName(event.strAwayTeam, teams);
    const userTeamId = user?.team_id ?? null;

    const hasUserTeam =
      userTeamId !== null &&
      (eventHomeTeamId === userTeamId || eventAwayTeamId === userTeamId);

    let homeTeamId: number | null;
    let awayTeamId: number | null;
    let homeTeamScore: number | null;
    let awayTeamScore: number | null;

    if (hasUserTeam && userTeamId !== null) {
      if (eventHomeTeamId === userTeamId) {
        homeTeamId = eventHomeTeamId;
        awayTeamId = eventAwayTeamId;
        homeTeamScore = Number(event.intHomeScore);
        awayTeamScore = Number(event.intAwayScore);
      } else {
        homeTeamId = eventAwayTeamId;
        awayTeamId = eventHomeTeamId;
        homeTeamScore = Number(event.intAwayScore);
        awayTeamScore = Number(event.intHomeScore);
      }
    } else {
      homeTeamId = eventHomeTeamId;
      awayTeamId = eventAwayTeamId;
      homeTeamScore = Number(event.intHomeScore);
      awayTeamScore = Number(event.intAwayScore);
    }

    const parseScore = (n: number) => (Number.isNaN(n) ? null : n);
    const eventHomeTeam = teams.find((t) => t.id === eventHomeTeamId);
    const stadiumId = eventHomeTeam?.stadium_id ?? null;

    setValue("homeTeamId", homeTeamId, {
      shouldDirty: !!homeTeamId,
      shouldValidate: !!homeTeamId,
    });
    setValue("awayTeamId", awayTeamId, {
      shouldDirty: !!awayTeamId,
      shouldValidate: !!awayTeamId,
    });
    setValue("homeTeamScore", parseScore(homeTeamScore), {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue("awayTeamScore", parseScore(awayTeamScore), {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue("stadiumId", stadiumId, {
      shouldDirty: !!stadiumId,
      shouldValidate: !!stadiumId,
    });
    setValue("youtubeUrl", event.strVideo ?? null);
  };

  const handleDateChange = () => {
    setSelectedEvent(null);
    setInputMode(null);
  };

  const handleSelectEvent = (event: KboEventRow) => {
    const isDeselecting = selectedEvent?.idEvent === event.idEvent;
    setSelectedEvent(isDeselecting ? null : event);
    setInputMode(isDeselecting ? null : "search");
    if (!isDeselecting) {
      applyEventToForm(event);
    }
  };

  const handleClickBack = () => {
    setStep(1);
  };

  const hasGames = (kboEvents?.length ?? 0) > 0;
  const isMainButtonEnabled = isLoading
    ? false
    : hasGames
      ? selectedEvent !== null
      : true;

  const handleClickNextStep = () => {
    if (hasGames && selectedEvent) {
      applyEventToForm(selectedEvent);
      setStep(2);
    } else if (!hasGames) {
      setValue("youtubeUrl", null);
      setInputMode("manual");
      setStep(2);
    }
  };

  const isFieldsLocked = defaultValues
    ? inputMode === "manual"
      ? false
      : !!defaultValues?.youtubeUrl
    : inputMode === "search" && step === 2;

  const getDisplayNames = (event: KboEventRow) => {
    if (!teams) return { homeTeamName: "", awayTeamName: "", stadiumName: "" };
    const homeTeamId = findTeamIdByKboName(event.strHomeTeam, teams);
    const awayTeamId = findTeamIdByKboName(event.strAwayTeam, teams);
    const homeTeam = teams.find((t) => t.id === homeTeamId);
    const stadiumId = homeTeam?.stadium_id ?? null;
    const stadium = stadiumId
      ? stadiums?.find((s) => s.id === stadiumId)
      : null;

    return {
      homeTeamName: homeTeam?.team_name ?? event.strHomeTeam,
      awayTeamName:
        teams.find((t) => t.id === awayTeamId)?.team_name ?? event.strAwayTeam,
      stadiumName: stadium?.name ?? event.strVenue ?? "경기장 정보 없음",
    };
  };

  const handleFormSubmit = defaultValues
    ? handleEditGameLog
    : handleCreateGameLog;

  return (
    <div className="flex h-dvh flex-col">
      <Header
        title={{
          text: defaultValues ? "직관 수정" : "직관 등록",
          position: "center",
        }}
        leftAction={
          <button
            type="button"
            onClick={
              step === 1
                ? () => {
                    router.push("/?tab=gameLogs");
                  }
                : handleClickBack
            }
          >
            <ChevronLeftIcon size={32} />
          </button>
        }
        rightAction={
          <button
            className="disabled:opacity-50"
            type="button"
            disabled={!isMainButtonEnabled}
            onClick={
              step === 1
                ? handleClickNextStep
                : handleSubmit(
                    async (formData) => {
                      setIsSending(true);
                      handleFormSubmit(formData);
                    },
                    (error) => {
                      const errors = Object.values(error);
                      const errorMessage =
                        errors.length === 1
                          ? errors[0]?.message
                          : "필수 입력 해주세요!";
                      toast.error(errorMessage);
                      setIsSending(false);
                    },
                  )
            }
          >
            {step === 1 ? (
              "다음"
            ) : isSending ? (
              <Spinner className="size-5 text-white" />
            ) : (
              "완료"
            )}
          </button>
        }
      />
      <form
        className={cn(
          "flex min-h-0 flex-1 flex-col overflow-hidden px-[16px] pb-[20px]",
          defaultValues && "py-[20px]",
        )}
      >
        {step === 1 ? (
          <CreateModeFormStep1
            control={control}
            matchDate={matchDate}
            kboEvents={kboEvents ?? []}
            isLoading={isLoading}
            selectedEvent={selectedEvent}
            isCalendarMounted={isCalendarMounted}
            getDisplayNames={getDisplayNames}
            handleDateChange={handleDateChange}
            handleSelectEvent={handleSelectEvent}
            handleClickMainButton={handleClickNextStep}
            isMainButtonEnabled={isMainButtonEnabled}
          />
        ) : (
          <CreateModeFormStep2
            control={control}
            register={register}
            watch={watch}
            setValue={setValue}
            teams={teams ?? []}
            stadiums={stadiums ?? []}
            initImageUrl={initImageUrl}
            isFieldsLocked={isFieldsLocked}
            setIsStadiumModalOpen={setIsStadiumModalOpen}
            setIsHomeTeamModalOpen={setIsHomeTeamModalOpen}
            setIsAwayTeamModalOpen={setIsAwayTeamModalOpen}
            isStadiumModalOpen={isStadiumModalOpen}
            isHomeTeamModalOpen={isHomeTeamModalOpen}
            isAwayTeamModalOpen={isAwayTeamModalOpen}
          />
        )}
      </form>
    </div>
  );
};

export default GameLogForm;
