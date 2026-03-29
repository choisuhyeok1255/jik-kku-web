"use client";

import dayjs from "dayjs";
import { Search } from "lucide-react";
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
  DatePicker,
  FileDropzone,
  LabelContent,
  Spinner,
  compressImage,
} from "@/src/shared";
import { findTeamIdByKboName } from "../lib/kboTeamMapping";
import GameLogSearchModal from "./GameLogSearchModal";
import GameLogStadiumModal from "./GameLogStadiumModal";
import GameLogTeamModal from "./GameLogTeamModal";

const GameLogForm = ({
  defaultValues,
  handleClickSubmit,
}: {
  defaultValues?: CreateGameLogForm | UpdateGameLogForm;
  handleClickSubmit:
    | ((body: CreateGameLogQueryModel["body"]) => void)
    | ((body: UpdateGameLogQueryModel["body"]) => void);
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

  const [isHomeTeamModalOpen, setIsHomeTeamModalOpen] = useState(false);
  const [isAwayTeamModalOpen, setIsAwayTeamModalOpen] = useState(false);
  const [isStadiumModalOpen, setIsStadiumModalOpen] = useState(false);
  const [isAutoSearchOpen, setIsAutoSearchOpen] = useState(false);
  const [isAutoSearchSelected, setIsAutoSearchSelected] = useState(false);

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
      {isAutoSearchOpen && watch("matchDate") && (
        <GameLogSearchModal
          date={watch("matchDate") ?? ""}
          teams={teams ?? []}
          stadiums={stadiums ?? []}
          userTeamId={user?.team_id ?? null}
          handleCloseModal={() => setIsAutoSearchOpen(false)}
          onSelectEvent={(event) => {
            if (!teams) return;
            const eventHomeTeamId = findTeamIdByKboName(
              event.strHomeTeam,
              teams,
            );
            const eventAwayTeamId = findTeamIdByKboName(
              event.strAwayTeam,
              teams,
            );
            const userTeamId = user?.team_id ?? null;

            const hasUserTeam =
              userTeamId !== null &&
              (eventHomeTeamId === userTeamId ||
                eventAwayTeamId === userTeamId);

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

            setIsAutoSearchOpen(false);
            setIsAutoSearchSelected(true);
          }}
        />
      )}
      <div className="flex flex-col gap-[40px]">
        <div className="flex flex-col gap-[16px]">
            <LabelContent label="날짜" isRequired>
              <div className="flex items-center gap-[8px]">
                <Controller
                  control={control}
                  name="matchDate"
                  rules={{ required: "날짜를 선택해주세요!" }}
                  render={({ field: { value, onChange } }) => (
                    <DatePicker
                      value={value}
                      onChange={onChange}
                      placeholder="날짜 선택"
                    />
                  )}
                />
              <button
                className="flex h-[48px] w-[50px] shrink-0 items-center justify-center rounded-[20px] border border-white/10 bg-[#ffffff]/4 text-[14px]"
                type="button"
                onClick={() => {
                  setIsAutoSearchOpen(true);
                }}
              >
                <Search />
              </button>
            </div>
          </LabelContent>
          <LabelContent label="경기장" isRequired>
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
                  disabled={isAutoSearchSelected}
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
                        "flex h-[48px] w-full items-center rounded-[20px] border border-white/10 bg-[#ffffff]/4 p-[14px] text-start text-[14px] disabled:cursor-not-allowed disabled:opacity-50",
                        !value && "text-[#ffffff]/60",
                      )}
                      type="button"
                      disabled={isAutoSearchSelected}
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
                        "flex h-[48px] w-full items-center rounded-[20px] border border-white/10 bg-[#ffffff]/4 p-[14px] text-start text-[14px] disabled:cursor-not-allowed disabled:opacity-50",
                        !value && "text-[#ffffff]/60",
                      )}
                      type="button"
                      disabled={isAutoSearchSelected}
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
                <div className="flex h-[48px] w-full items-center rounded-[20px] border border-white/10 bg-[#ffffff]/4 px-[14px] has-disabled:cursor-not-allowed has-disabled:opacity-50">
                  <input
                    className="min-w-0 flex-1 [appearance:textfield] bg-transparent disabled:cursor-not-allowed [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    min={0}
                    max={50}
                    step={1}
                    type="number"
                    placeholder="0"
                    disabled={isAutoSearchSelected}
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
                <div className="flex h-[48px] w-full items-center rounded-[20px] border border-white/10 bg-[#ffffff]/4 px-[14px] has-disabled:cursor-not-allowed has-disabled:opacity-50">
                  <input
                    className="min-w-0 flex-1 [appearance:textfield] bg-transparent disabled:cursor-not-allowed [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    min={0}
                    max={50}
                    step={1}
                    type="number"
                    placeholder="0"
                    disabled={isAutoSearchSelected}
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
                placeholder="오늘 경기는 어땠나요?"
                {...register("note", { maxLength: 200 })}
              />
            </LabelContent>
            <LabelContent label="사진">
              <Notification
                className="mb-[4px]"
                text=<>
                  사진을 추가하면 랭킹에 바로 반영돼요.
                  <br /> 경기와 무관한 사진은 추후 인증이 취소될 수 있어요
                </>
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
