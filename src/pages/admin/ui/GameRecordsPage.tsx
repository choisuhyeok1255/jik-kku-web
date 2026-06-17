"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import {
  getStadiums,
  type KboGameListItem,
  type KboGameListResponse,
  useGetTeams,
} from "@/src/entities";
import { Header, supabase } from "@/src/shared";
import type { Database } from "@/src/shared/lib/supabase.types";

import {
  buildGameRecordId,
  buildPreviewRowsFromKboGame,
  buildPreviewRowsFromTheSportsDb,
  formatPreviewScore,
  isValidTheSportsDbPreviewForInsert,
  resolveTheSportsDbDbGameFields,
  type PreviewRow,
  type TheSportsDbPreviewRow,
} from "../lib/gameRecordsAdmin";
import {
  fetchKboGameResultsByDate,
  logKboRecentGameResults,
  type KboDateGameResults,
  type KboTodayGameResults,
} from "../lib/theSportDb";

type GameRecordRow = Database["public"]["Tables"]["game_records"]["Row"];
type GameRecordInsert = Database["public"]["Tables"]["game_records"]["Insert"];

const previewTableShell =
  "w-full min-w-0 max-w-full border-collapse text-left text-[13px] text-white/90";

const dbTableShell =
  "w-full min-w-[720px] border-collapse text-left text-[13px] text-white/90";

const th = "border border-white/10 bg-white/6 px-2 py-2 font-medium";
const td = "border border-white/10 px-2 py-2 align-top";

const GameRecordsPage = () => {
  const [dateInput, setDateInput] = useState(() =>
    dayjs().format("YYYY-MM-DD"),
  );
  const [manualMatchDate, setManualMatchDate] = useState(() =>
    dayjs().format("YYYY-MM-DD"),
  );
  const [manualHomeTeamId, setManualHomeTeamId] = useState<number | "">("");
  const [manualAwayTeamId, setManualAwayTeamId] = useState<number | "">("");
  const [manualSeq, setManualSeq] = useState(1);
  const [manualHomeScore, setManualHomeScore] = useState("");
  const [manualAwayScore, setManualAwayScore] = useState("");
  const [manualStatus, setManualStatus] = useState("경기 전");
  const [manualStadiumId, setManualStadiumId] = useState<number | "">("");
  const [manualYoutube, setManualYoutube] = useState("");
  const [editBatchDate, setEditBatchDate] = useState(() =>
    dayjs().format("YYYY-MM-DD"),
  );
  const [editRows, setEditRows] = useState<GameRecordRow[]>([]);
  const [scheduleFetchLoading, setScheduleFetchLoading] = useState(false);
  /** kbo-game(`/api/kbo/kbo-game`)로 불러온 일정, `null`이면 아직 조회 전 */
  const [kboGamePreview, setKboGamePreview] = useState<
    KboGameListItem[] | null
  >(null);
  const [kboGamePreviewDate, setKboGamePreviewDate] = useState<string | null>(
    null,
  );
  const [theSportsDbResults, setTheSportsDbResults] =
    useState<KboTodayGameResults | null>(null);
  const [theSportsDbFetchLoading, setTheSportsDbFetchLoading] = useState(false);
  const [theSportsDbPickDate, setTheSportsDbPickDate] = useState(() =>
    dayjs().format("YYYY-MM-DD"),
  );
  const [theSportsDbPickResults, setTheSportsDbPickResults] =
    useState<KboDateGameResults | null>(null);
  const [theSportsDbPickLoading, setTheSportsDbPickLoading] = useState(false);

  const handleDateChange = (value: string) => {
    setDateInput(value);
  };

  /**
   * KBO 일정은 `kbo-game` → 서버 `GET /api/kbo/kbo-game`(CORS 없음)만 사용합니다.
   * @see `app/api/kbo/kbo-game/route.ts`
   */
  const handleFetchApi = async () => {
    setScheduleFetchLoading(true);
    try {
      const res = await fetch(
        `/api/kbo/kbo-game?date=${encodeURIComponent(dateInput)}`,
      );
      const body: unknown = await res.json();
      if (res.ok) {
        const list = body as KboGameListResponse;
        const items = list === null ? [] : list;
        setKboGamePreview(items);
        setKboGamePreviewDate(dateInput);
      } else {
        setKboGamePreview(null);
        setKboGamePreviewDate(null);
        toast.error("일정 API 오류", {
          description:
            typeof body === "object" &&
            body !== null &&
            "error" in body &&
            typeof (body as { error: string }).error === "string"
              ? (body as { error: string }).error
              : res.statusText,
        });
      }
    } catch (e) {
      setKboGamePreview(null);
      setKboGamePreviewDate(null);
      toast.error("일정 요청 실패", {
        description: e instanceof Error ? e.message : String(e),
      });
    } finally {
      setScheduleFetchLoading(false);
    }
  };

  /** TheSportsDB 오늘·어제(KST) 경기 결과 — `logKboRecentGameResults`로 조회 */
  const handleFetchTheSportsDbResults = async () => {
    setTheSportsDbFetchLoading(true);
    try {
      const result = await logKboRecentGameResults();
      setTheSportsDbResults(result);
    } catch (e) {
      // 새로 고침 실패 시에도 기존 표 데이터를 유지해 UI가 흔들리지 않게 함
      toast.error("TheSportsDB 조회 실패", {
        description: e instanceof Error ? e.message : String(e),
      });
    } finally {
      setTheSportsDbFetchLoading(false);
    }
  };

  const handleTheSportsDbRefresh = () => {
    void handleFetchTheSportsDbResults();
  };

  /** 6번: TheSportsDB 지정 날짜 경기 결과 조회 */
  const handleFetchTheSportsDbByDate = async () => {
    setTheSportsDbPickLoading(true);
    try {
      const result = await fetchKboGameResultsByDate(theSportsDbPickDate);
      setTheSportsDbPickResults(result);
    } catch (e) {
      toast.error("TheSportsDB 조회 실패", {
        description: e instanceof Error ? e.message : String(e),
      });
    } finally {
      setTheSportsDbPickLoading(false);
    }
  };

  const handleTheSportsDbPickDateChange = (value: string) => {
    setTheSportsDbPickDate(value);
  };

  const { data: teams, isLoading: loadingTeams } = useGetTeams();

  const handleManualHomeTeamChange = (value: string) => {
    if (value === "") {
      setManualHomeTeamId("");
      return;
    }
    const id = Number(value);
    setManualHomeTeamId(id);
    const t = teams?.find((x) => x.id === id);
    if (t?.stadium_id != null) setManualStadiumId(t.stadium_id);
  };

  const handleManualAwayTeamChange = (value: string) => {
    if (value === "") {
      setManualAwayTeamId("");
      return;
    }
    setManualAwayTeamId(Number(value));
  };

  const handleResetManual = () => {
    setManualHomeTeamId("");
    setManualAwayTeamId("");
    setManualSeq(1);
    setManualHomeScore("");
    setManualAwayScore("");
    setManualStadiumId("");
    setManualYoutube("");
  };

  const handleEditRowPatch = (id: number, patch: Partial<GameRecordRow>) => {
    setEditRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...patch } : r)),
    );
  };

  const previewRows: PreviewRow[] = useMemo(() => {
    if (!teams?.length) return [];
    if (kboGamePreview == null || !kboGamePreviewDate) return [];
    if (kboGamePreview.length === 0) return [];
    return buildPreviewRowsFromKboGame(
      kboGamePreview,
      teams,
      kboGamePreviewDate,
    );
  }, [kboGamePreview, kboGamePreviewDate, teams]);

  const theSportsDbYesterdayPreviewRows: TheSportsDbPreviewRow[] = useMemo(() => {
    if (!teams?.length || !theSportsDbResults) return [];
    return buildPreviewRowsFromTheSportsDb(
      theSportsDbResults.yesterdayGames,
      teams,
    );
  }, [theSportsDbResults, teams]);

  const theSportsDbTodayPreviewRows: TheSportsDbPreviewRow[] = useMemo(() => {
    if (!teams?.length || !theSportsDbResults) return [];
    return buildPreviewRowsFromTheSportsDb(theSportsDbResults.todayGames, teams);
  }, [theSportsDbResults, teams]);

  const theSportsDbPickPreviewRows: TheSportsDbPreviewRow[] = useMemo(() => {
    if (!teams?.length || !theSportsDbPickResults) return [];
    return buildPreviewRowsFromTheSportsDb(theSportsDbPickResults.games, teams);
  }, [theSportsDbPickResults, teams]);

  const teamLabelById = useMemo(() => {
    const map = new Map<number, string>();
    teams?.forEach((t) => {
      const label =
        t.short_team_name?.trim() ||
        t.team_name?.trim() ||
        t.team_name_en?.trim() ||
        `#${t.id}`;
      map.set(t.id, label);
    });
    return map;
  }, [teams]);

  const { data: stadiumsForManual } = useQuery({
    queryKey: ["stadiums", "manual-form"],
    queryFn: getStadiums,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const sortedStadiums = useMemo(() => {
    return [...(stadiumsForManual ?? [])].sort((a, b) =>
      (a.name ?? "").localeCompare(b.name ?? ""),
    );
  }, [stadiumsForManual]);

  const stadiumLabelById = useMemo(() => {
    const map = new Map<number, string>();
    stadiumsForManual?.forEach((s) => {
      const label = s.name?.trim() || `#${s.id}`;
      map.set(s.id, label);
    });
    return map;
  }, [stadiumsForManual]);

  const computedManualId = useMemo(() => {
    if (
      !manualMatchDate ||
      manualHomeTeamId === "" ||
      manualAwayTeamId === ""
    ) {
      return "";
    }
    return buildGameRecordId(
      dayjs(manualMatchDate).format("YYMMDD"),
      Number(manualHomeTeamId),
      Number(manualAwayTeamId),
      manualSeq,
    );
  }, [manualMatchDate, manualHomeTeamId, manualAwayTeamId, manualSeq]);

  const queryClient = useQueryClient();

  const applyPreviewMutation = useMutation({
    mutationFn: async () => {
      const valid = previewRows.filter(isValidPreviewForInsert);
      if (valid.length === 0) {
        throw new Error(
          "반영할 수 있는 행이 없습니다. 팀·구장 매핑과 비고를 확인하세요.",
        );
      }
      const payload: GameRecordInsert[] = valid.map((r) => ({
        id: Number(r.id),
        home_team_id: r.homeTeamId!,
        away_team_id: r.awayTeamId!,
        home_team_score: null,
        away_team_score: null,
        status: "경기 전",
        match_date: r.matchDate,
        stadium_id: r.stadiumId!,
        youtube_url: null,
      }));
      const { error } = await supabase
        .from("game_records")
        .upsert(payload, { onConflict: "id" });
      if (error) throw error;
      return valid.length;
    },
    onSuccess: (count) => {
      void queryClient.invalidateQueries({ queryKey: ["admin-game-records"] });
      toast.success(`${count}건을 DB에 반영했습니다.`);
    },
    onError: (e: unknown) => {
      toast.error(e instanceof Error ? e.message : "DB 반영에 실패했습니다.");
    },
  });

  const handleDbApply = () => {
    if (kboGamePreviewDate && dateInput !== kboGamePreviewDate) {
      toast.message("참고", {
        description:
          "상단 「경기 날짜」와 미리보기 조회 날짜가 다릅니다. 아래 목록(2번)은 상단 날짜 기준이니, 확인 후 날짜를 맞추세요.",
      });
    }
    applyPreviewMutation.mutate();
  };

  const applyTheSportsDbMutation = useMutation({
    mutationFn: async ({
      rows,
      label,
    }: {
      rows: TheSportsDbPreviewRow[];
      label: string;
    }) => {
      const valid = rows.filter(isValidTheSportsDbPreviewForInsert);
      if (valid.length === 0) {
        throw new Error(
          "반영할 수 있는 행이 없습니다. 팀·구장 매핑과 비고를 확인하세요.",
        );
      }
      const payload: GameRecordInsert[] = valid.map((r) => {
        const dbFields = resolveTheSportsDbDbGameFields({
          apiStatus: r.apiStatus,
          homeScore: r.homeScore,
          awayScore: r.awayScore,
          youtubeUrl: r.youtubeUrl,
        });
        return {
          id: Number(r.id),
          home_team_id: r.homeTeamId!,
          away_team_id: r.awayTeamId!,
          home_team_score: dbFields.homeScore,
          away_team_score: dbFields.awayScore,
          status: dbFields.status,
          match_date: r.matchDate,
          stadium_id: r.stadiumId!,
          youtube_url: dbFields.youtubeUrl,
        };
      });
      const { error } = await supabase
        .from("game_records")
        .upsert(payload, { onConflict: "id" });
      if (error) throw error;
      return { count: valid.length, label };
    },
    onSuccess: ({ count, label }) => {
      void queryClient.invalidateQueries({ queryKey: ["admin-game-records"] });
      void queryClient.invalidateQueries({
        queryKey: ["admin-game-records-edit-batch"],
      });
      toast.success(`TheSportsDB ${label} ${count}건을 DB에 반영했습니다.`);
    },
    onError: (e: unknown) => {
      toast.error(e instanceof Error ? e.message : "DB 반영에 실패했습니다.");
    },
  });

  const handleTheSportsDbSaveYesterday = () => {
    applyTheSportsDbMutation.mutate({
      rows: theSportsDbYesterdayPreviewRows,
      label: `어제(${theSportsDbResults?.yesterdayKst ?? ""})`,
    });
  };

  const handleTheSportsDbSaveToday = () => {
    applyTheSportsDbMutation.mutate({
      rows: theSportsDbTodayPreviewRows,
      label: `오늘(${theSportsDbResults?.todayKst ?? ""})`,
    });
  };

  const handleTheSportsDbSavePickDate = () => {
    applyTheSportsDbMutation.mutate({
      rows: theSportsDbPickPreviewRows,
      label: `날짜 지정(${theSportsDbPickDate})`,
    });
  };

  const insertManualMutation = useMutation({
    mutationFn: async () => {
      if (
        !computedManualId ||
        manualHomeTeamId === "" ||
        manualAwayTeamId === "" ||
        manualStadiumId === ""
      ) {
        throw new Error("경기 날짜·홈·원정·경기장을 입력하세요.");
      }
      if (Number(manualHomeTeamId) === Number(manualAwayTeamId)) {
        throw new Error("홈·원정 팀은 같을 수 없습니다.");
      }
      if (manualSeq < 1) {
        throw new Error("seq는 1 이상이어야 합니다.");
      }
      const hs = manualHomeScore.trim();
      const aws = manualAwayScore.trim();
      const homeScore = hs === "" ? null : Number(hs);
      const awayScore = aws === "" ? null : Number(aws);
      if (hs !== "" && !Number.isFinite(homeScore)) {
        throw new Error("홈 점수 형식이 올바르지 않습니다.");
      }
      if (aws !== "" && !Number.isFinite(awayScore)) {
        throw new Error("원정 점수 형식이 올바르지 않습니다.");
      }
      const payload: GameRecordInsert = {
        id: Number(computedManualId),
        home_team_id: Number(manualHomeTeamId),
        away_team_id: Number(manualAwayTeamId),
        home_team_score: homeScore,
        away_team_score: awayScore,
        status: manualStatus.trim() || "경기 전",
        match_date: manualMatchDate,
        stadium_id: Number(manualStadiumId),
        youtube_url: manualYoutube.trim() === "" ? null : manualYoutube.trim(),
      };
      const { error } = await supabase
        .from("game_records")
        .upsert(payload, { onConflict: "id" });
      if (error) throw error;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin-game-records"] });
      toast.success("수기 입력한 경기를 저장했습니다.");
    },
    onError: (e: unknown) => {
      toast.error(e instanceof Error ? e.message : "저장에 실패했습니다.");
    },
  });

  const handleSubmitManual = () => {
    insertManualMutation.mutate();
  };

  const { data: dbRecords, isLoading: loadingDb } = useQuery({
    queryKey: ["admin-game-records", dateInput],
    queryFn: async (): Promise<GameRecordRow[]> => {
      const { data, error } = await supabase
        .from("game_records")
        .select("*")
        .eq("match_date", dateInput)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as GameRecordRow[];
    },
    enabled: !!dateInput,
  });

  const {
    data: fetchedEditRows,
    isLoading: loadingEditFetch,
    refetch: refetchEditRows,
  } = useQuery({
    queryKey: ["admin-game-records-edit-batch", editBatchDate],
    queryFn: async (): Promise<GameRecordRow[]> => {
      const { data, error } = await supabase
        .from("game_records")
        .select("*")
        .eq("match_date", editBatchDate)
        .order("id", { ascending: true });
      if (error) throw error;
      return (data ?? []) as GameRecordRow[];
    },
    enabled: !!editBatchDate,
  });

  const batchSaveEditMutation = useMutation({
    mutationFn: async () => {
      if (editRows.length === 0) {
        throw new Error("저장할 행이 없습니다.");
      }
      for (const r of editRows) {
        const hs = r.home_team_score;
        const aws = r.away_team_score;
        if (hs != null && !Number.isFinite(hs)) {
          throw new Error(`id ${r.id}: 홈 점수 형식이 올바르지 않습니다.`);
        }
        if (aws != null && !Number.isFinite(aws)) {
          throw new Error(`id ${r.id}: 원정 점수 형식이 올바르지 않습니다.`);
        }
      }
      const payload: GameRecordInsert[] = editRows.map((r) => {
        const yt = r.youtube_url?.trim() ?? "";
        return {
          id: r.id,
          home_team_id: r.home_team_id,
          away_team_id: r.away_team_id,
          home_team_score: r.home_team_score,
          away_team_score: r.away_team_score,
          status: r.status.trim() || "경기 전",
          match_date: r.match_date,
          stadium_id: r.stadium_id,
          youtube_url: yt === "" ? null : yt,
        };
      });
      const { error } = await supabase
        .from("game_records")
        .upsert(payload, { onConflict: "id" });
      if (error) throw error;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin-game-records"] });
      void queryClient.invalidateQueries({
        queryKey: ["admin-game-records-edit-batch"],
      });
      toast.success("선택한 날짜의 수정 사항을 저장했습니다.");
    },
    onError: (e: unknown) => {
      toast.error(e instanceof Error ? e.message : "저장에 실패했습니다.");
    },
  });

  const handleBatchEditSave = () => {
    batchSaveEditMutation.mutate();
  };

  const handleBatchEditReload = () => {
    void refetchEditRows();
  };

  useEffect(() => {
    if (fetchedEditRows) {
      // "경기 전"이면 "경기 종료"로 기본값을 제안하고, 그 외 상태는 서버 값을 그대로 유지합니다.
      setEditRows(
        fetchedEditRows.map((r) =>
          r.status === "경기 전" ? { ...r, status: "경기 종료" } : r,
        ),
      );
    }
  }, [fetchedEditRows]);

  // 5번: 페이지 진입 시 TheSportsDB 오늘 경기 결과 자동 조회
  useEffect(() => {
    void handleFetchTheSportsDbResults();
  }, []);

  const shouldHighlightApiButton =
    kboGamePreviewDate != null && dateInput !== kboGamePreviewDate;

  return (
    <div className="flex h-dvh flex-col">
      <Header
        className="mb-[12px] shrink-0"
        title={{ text: "경기 기록", position: "left" }}
        prevPage={{ href: "/admin" }}
      />
      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 pb-6">
        <section className="rounded-[16px] border border-white/10 bg-white/4 p-4">
          <p className="mb-3 text-[12px] leading-relaxed text-white/55">
            일정은 kbo-game 기반{" "}
            <code className="text-white/70">/api/kbo/kbo-game</code>(
            <a
              href="https://github.com/NomaDamas/k-skill/blob/main/docs/features/kbo-results.md"
              target="_blank"
              rel="noreferrer"
              className="text-violet-200/90 underline decoration-violet-400/50 underline-offset-2 hover:text-violet-100"
            >
              k-skill 가이드
            </a>
            )로만 불러옵니다. 아래 미리보기는{" "}
            <span className="text-white/80">id·팀·구장만 계산한 값</span>이고,
            「DB 반영」으로 저장합니다. 동일 id는{" "}
            <span className="text-amber-200/90">upsert(덮어쓰기)</span>입니다.
          </p>
          <div className="flex flex-wrap items-end gap-3">
            <label className="flex flex-col gap-1 text-[12px] text-white/70">
              경기 날짜
              <input
                type="date"
                value={dateInput}
                onChange={(e) => handleDateChange(e.target.value)}
                className="rounded-[10px] border border-white/15 bg-[#232323] px-3 py-2 text-[14px] text-white"
              />
            </label>
            <button
              type="button"
              onClick={() => {
                void handleFetchApi();
              }}
              disabled={scheduleFetchLoading}
              className={
                shouldHighlightApiButton
                  ? "rounded-[12px] bg-amber-500/25 px-4 py-2 text-[14px] font-semibold text-amber-100 ring-2 ring-amber-400/60 ring-offset-2 ring-offset-[#181818] transition-opacity hover:bg-amber-500/35 disabled:opacity-50"
                  : "rounded-[12px] bg-white/15 px-4 py-2 text-[14px] font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              }
            >
              {scheduleFetchLoading ? "불러오는 중…" : "API 불러오기"}
            </button>
          </div>
          {kboGamePreviewDate && kboGamePreviewDate !== dateInput && (
            <p className="mt-2 text-[11px] text-amber-200/80">
              표시 중인 API 데이터 날짜: {kboGamePreviewDate} (날짜만 바꾼 경우
              다시 「API 불러오기」)
            </p>
          )}
        </section>

        <section className="rounded-[16px] border border-white/10 bg-white/4 p-4">
          <h2 className="mb-2 text-[15px] font-semibold text-white">
            1. API 미리보기 (kbo-game → 생성 예정 행)
          </h2>
          <p className="mb-3 text-[12px] text-white/50">
            정렬: 같은 날 기준 경기 시각 최신순 · 점수/유튜브는 미경기 가정으로
            비워 두고 &quot;경기 전&quot; 상태로 두면 됩니다.
          </p>
          {scheduleFetchLoading && (
            <p className="mb-1 text-[12px] text-violet-200/80">
              kbo-game 일정 불러오는 중…
            </p>
          )}
          {kboGamePreview == null && !scheduleFetchLoading && (
            <p className="text-[13px] text-white/45">
              날짜 선택 후 「API 불러오기」로 일정을 불러오세요.
            </p>
          )}
          {loadingTeams && kboGamePreview != null && (
            <p className="text-[13px] text-white/55">팀 목록 로딩…</p>
          )}
          {kboGamePreview != null &&
            kboGamePreview.length === 0 &&
            kboGamePreviewDate &&
            !loadingTeams && (
              <p className="text-[13px] text-white/55">
                해당 날짜에 조회된 경기가 없습니다.
              </p>
            )}
          {previewRows.length > 0 && (
            <div className="overflow-x-auto">
              <table className={previewTableShell}>
                <thead>
                  <tr>
                    <th className={th}>생성 id (미리보기)</th>
                    <th className={th}>홈 · 원정</th>
                    <th className={th}>경기장</th>
                    <th className={th}>seq</th>
                    <th className={th}>비고</th>
                  </tr>
                </thead>
                <tbody>
                  {previewRows.map((row) => (
                    <tr key={row.idEvent}>
                      <td className={`${td} font-mono text-[12px]`}>
                        {row.id || "—"}
                      </td>
                      <td className={td}>
                        <div className="wrap-break-word">
                          {row.homeTeamId != null
                            ? (teamLabelById.get(row.homeTeamId) ??
                              row.homeTeamId)
                            : row.homeTeamName}{" "}
                          vs{" "}
                          {row.awayTeamId != null
                            ? (teamLabelById.get(row.awayTeamId) ??
                              row.awayTeamId)
                            : row.awayTeamName}
                        </div>
                        <div className="mt-1 text-[11px] text-white/40">
                          id {row.homeTeamId ?? "?"} · {row.awayTeamId ?? "?"}
                        </div>
                      </td>
                      <td className={td}>{row.stadiumId ?? "—"}</td>
                      <td className={td}>{pad2Display(row.sequence)}</td>
                      <td className={td}>
                        {row.issues.length > 0 ? (
                          <ul className="list-inside list-disc text-amber-200/90">
                            {row.issues.map((m) => (
                              <li key={m}>{m}</li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-white/35">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {previewRows.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleDbApply}
                disabled={
                  applyPreviewMutation.isPending ||
                  !previewRows.some(isValidPreviewForInsert)
                }
                className="rounded-[12px] bg-emerald-600/90 px-4 py-2 text-[14px] font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {applyPreviewMutation.isPending ? "반영 중…" : "DB 반영"}
              </button>
              <span className="text-[11px] text-white/45">
                비고(매핑 오류)가 있는 행은 제외됩니다.
              </span>
            </div>
          )}
        </section>

        <section className="rounded-[16px] border border-white/10 bg-white/4 p-4">
          <h2 className="mb-2 text-[15px] font-semibold text-white">
            2. DB에 있는 경기
          </h2>
          <p className="mb-3 text-[12px] text-white/50">
            위에서 고른 날짜(`{dateInput}`)의 `game_records`입니다. 정렬: 경기일
            최신 우선, 같은 날이면 생성 시각 최신순에 가깝게.
          </p>
          {loadingDb && (
            <p className="text-[13px] text-white/55">불러오는 중…</p>
          )}
          {!loadingDb && (dbRecords?.length ?? 0) === 0 && (
            <p className="text-[13px] text-white/45">
              이 날짜로 저장된 행이 없습니다.
            </p>
          )}
          {(dbRecords?.length ?? 0) > 0 && (
            <div className="overflow-x-auto">
              <table className={dbTableShell}>
                <thead>
                  <tr>
                    <th className={th}>id</th>
                    <th className={th}>홈·원정</th>
                    <th className={th}>점수</th>
                    <th className={th}>status</th>
                    <th className={th}>stadium</th>
                    <th className={th}>youtube</th>
                    <th className={th}>created_at</th>
                  </tr>
                </thead>
                <tbody>
                  {(dbRecords ?? []).map((r) => (
                    <tr key={r.id}>
                      <td className={`${td} font-mono text-[11px]`}>{r.id}</td>
                      <td className={td}>
                        <div>
                          {teamLabelById.get(r.home_team_id) ?? r.home_team_id}{" "}
                          vs{" "}
                          {teamLabelById.get(r.away_team_id) ?? r.away_team_id}
                        </div>
                        <div className="mt-1 text-[11px] text-white/40">
                          id {r.home_team_id} · {r.away_team_id}
                        </div>
                      </td>
                      <td className={td}>
                        {r.home_team_score ?? "—"} : {r.away_team_score ?? "—"}
                      </td>
                      <td className={td}>{r.status}</td>
                      <td className={td}>{r.stadium_id}</td>
                      <td className={`${td} max-w-[120px] truncate`}>
                        {r.youtube_url ?? "—"}
                      </td>
                      <td className={`${td} text-[11px] text-white/60`}>
                        {r.created_at}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="rounded-[16px] border border-white/10 bg-white/4 p-4">
          <h2 className="mb-2 text-[15px] font-semibold text-white">
            3. 수기 입력
          </h2>
          <p className="mb-4 text-[12px] leading-relaxed text-white/50">
            1번과 동일하게{" "}
            <span className="text-white/75">
              YYMMDD + 홈 team_id + 원정 team_id + seq(더블헤더 순번)
            </span>
            으로 id가 자동 계산됩니다. 홈 팀을 고르면 경기장은 팀 기본 구장으로
            채워지며 수정할 수 있습니다. 저장은{" "}
            <span className="text-amber-200/90">upsert(동일 id 덮어쓰기)</span>
            입니다.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full max-w-[520px] border-collapse text-[13px] text-white/90">
              <tbody>
                <tr>
                  <td className="border border-white/10 bg-white/6 px-3 py-2 text-white/65">
                    경기 날짜
                  </td>
                  <td className="border border-white/10 px-3 py-2">
                    <input
                      type="date"
                      value={manualMatchDate}
                      onChange={(e) => setManualMatchDate(e.target.value)}
                      className="w-full min-w-0 rounded-[8px] border border-white/15 bg-[#232323] px-2 py-1.5 text-[14px] text-white"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border border-white/10 bg-white/6 px-3 py-2 text-white/65">
                    홈 팀
                  </td>
                  <td className="border border-white/10 px-3 py-2">
                    <select
                      value={
                        manualHomeTeamId === "" ? "" : String(manualHomeTeamId)
                      }
                      onChange={(e) =>
                        handleManualHomeTeamChange(e.target.value)
                      }
                      className="w-full min-w-0 rounded-[8px] border border-white/15 bg-[#232323] px-2 py-1.5 text-[14px] text-white"
                    >
                      <option value="">선택</option>
                      {teams?.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.short_team_name ?? t.team_name ?? `#${t.id}`}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
                <tr>
                  <td className="border border-white/10 bg-white/6 px-3 py-2 text-white/65">
                    원정 팀
                  </td>
                  <td className="border border-white/10 px-3 py-2">
                    <select
                      value={
                        manualAwayTeamId === "" ? "" : String(manualAwayTeamId)
                      }
                      onChange={(e) =>
                        handleManualAwayTeamChange(e.target.value)
                      }
                      className="w-full min-w-0 rounded-[8px] border border-white/15 bg-[#232323] px-2 py-1.5 text-[14px] text-white"
                    >
                      <option value="">선택</option>
                      {teams?.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.short_team_name ?? t.team_name ?? `#${t.id}`}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
                <tr>
                  <td className="border border-white/10 bg-white/6 px-3 py-2 text-white/65">
                    seq
                  </td>
                  <td className="border border-white/10 px-3 py-2">
                    <input
                      type="number"
                      min={1}
                      value={manualSeq}
                      onChange={(e) =>
                        setManualSeq(
                          Math.max(1, Number.parseInt(e.target.value, 10) || 1),
                        )
                      }
                      className="w-24 rounded-[8px] border border-white/15 bg-[#232323] px-2 py-1.5 text-[14px] text-white"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border border-white/10 bg-white/6 px-3 py-2 text-white/65">
                    생성 id
                  </td>
                  <td className="border border-white/10 px-3 py-2 font-mono text-[12px] text-amber-200/90">
                    {computedManualId || "—"}
                  </td>
                </tr>
                <tr>
                  <td className="border border-white/10 bg-white/6 px-3 py-2 text-white/65">
                    홈 점수
                  </td>
                  <td className="border border-white/10 px-3 py-2">
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="비우면 null"
                      value={manualHomeScore}
                      onChange={(e) => setManualHomeScore(e.target.value)}
                      className="w-full min-w-0 rounded-[8px] border border-white/15 bg-[#232323] px-2 py-1.5 text-[14px] text-white"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border border-white/10 bg-white/6 px-3 py-2 text-white/65">
                    원정 점수
                  </td>
                  <td className="border border-white/10 px-3 py-2">
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="비우면 null"
                      value={manualAwayScore}
                      onChange={(e) => setManualAwayScore(e.target.value)}
                      className="w-full min-w-0 rounded-[8px] border border-white/15 bg-[#232323] px-2 py-1.5 text-[14px] text-white"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border border-white/10 bg-white/6 px-3 py-2 text-white/65">
                    status
                  </td>
                  <td className="border border-white/10 px-3 py-2">
                    <input
                      type="text"
                      value={manualStatus}
                      onChange={(e) => setManualStatus(e.target.value)}
                      className="w-full min-w-0 rounded-[8px] border border-white/15 bg-[#232323] px-2 py-1.5 text-[14px] text-white"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border border-white/10 bg-white/6 px-3 py-2 text-white/65">
                    경기장
                  </td>
                  <td className="border border-white/10 px-3 py-2">
                    <select
                      value={
                        manualStadiumId === "" ? "" : String(manualStadiumId)
                      }
                      onChange={(e) =>
                        setManualStadiumId(
                          e.target.value === "" ? "" : Number(e.target.value),
                        )
                      }
                      className="w-full min-w-0 rounded-[8px] border border-white/15 bg-[#232323] px-2 py-1.5 text-[14px] text-white"
                    >
                      <option value="">선택</option>
                      {sortedStadiums.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name ?? `#${s.id}`}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
                <tr>
                  <td className="border border-white/10 bg-white/6 px-3 py-2 text-white/65">
                    youtube
                  </td>
                  <td className="border border-white/10 px-3 py-2">
                    <input
                      type="url"
                      placeholder="비우면 null"
                      value={manualYoutube}
                      onChange={(e) => setManualYoutube(e.target.value)}
                      className="w-full min-w-0 rounded-[8px] border border-white/15 bg-[#232323] px-2 py-1.5 text-[14px] text-white"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleSubmitManual}
              disabled={
                insertManualMutation.isPending ||
                !computedManualId ||
                manualHomeTeamId === "" ||
                manualAwayTeamId === "" ||
                manualStadiumId === ""
              }
              className="rounded-[12px] bg-sky-600/90 px-4 py-2 text-[14px] font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {insertManualMutation.isPending ? "저장 중…" : "저장"}
            </button>
            <button
              type="button"
              onClick={handleResetManual}
              disabled={insertManualMutation.isPending}
              className="rounded-[12px] border border-white/20 bg-white/5 px-4 py-2 text-[14px] font-medium text-white/85 transition-opacity hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              초기화
            </button>
            <span className="text-[11px] text-white/40">
              경기 날짜·status는 유지됩니다.
            </span>
          </div>
        </section>

        <section className="rounded-[16px] border border-white/10 bg-white/4 p-4">
          <h2 className="mb-2 text-[15px] font-semibold text-white">
            4. 일괄 수정 (날짜별)
          </h2>
          <p className="mb-3 text-[12px] leading-relaxed text-white/50">
            날짜를 고르면 해당 <span className="text-white/75">match_date</span>
            의 모든 경기를 불러와 테이블에서 수정합니다. 「전체 저장」은{" "}
            <span className="text-amber-200/90">upsert</span>로 한 번에
            반영합니다. 날짜를 바꾸면 서버 데이터로 다시 채워지므로, 저장 전에
            날짜를 바꾸지 마세요.
          </p>
          <div className="mb-4 flex flex-wrap items-end gap-3">
            <label className="flex flex-col gap-1 text-[12px] text-white/70">
              수정할 날짜
              <input
                type="date"
                value={editBatchDate}
                onChange={(e) => setEditBatchDate(e.target.value)}
                className="rounded-[10px] border border-white/15 bg-[#232323] px-3 py-2 text-[14px] text-white"
              />
            </label>
            <button
              type="button"
              onClick={handleBatchEditReload}
              disabled={loadingEditFetch}
              className="rounded-[12px] border border-white/20 bg-white/5 px-4 py-2 text-[14px] font-medium text-white/85 transition-opacity hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loadingEditFetch ? "불러오는 중…" : "다시 불러오기"}
            </button>
          </div>
          {loadingEditFetch && editRows.length === 0 && (
            <p className="text-[13px] text-white/55">불러오는 중…</p>
          )}
          {!loadingEditFetch && editRows.length === 0 && (
            <p className="text-[13px] text-white/45">
              이 날짜로 저장된 경기가 없습니다.
            </p>
          )}
          {editRows.length > 0 && (
            <>
              <div className="overflow-x-auto">
                <table className={`${dbTableShell} min-w-[960px]`}>
                  <thead>
                    <tr>
                      <th className={th}>id</th>
                      <th className={th}>홈·원정</th>
                      <th className={th}>홈 점수</th>
                      <th className={th}>원정 점수</th>
                      <th className={th}>status</th>
                      <th className={th}>경기장</th>
                      <th className={th}>youtube</th>
                    </tr>
                  </thead>
                  <tbody>
                    {editRows.map((r) => (
                      <tr key={r.id}>
                        <td className={`${td} font-mono text-[11px]`}>
                          {r.id}
                        </td>
                        <td className={td}>
                          <div>
                            {teamLabelById.get(r.home_team_id) ??
                              r.home_team_id}{" "}
                            vs{" "}
                            {teamLabelById.get(r.away_team_id) ??
                              r.away_team_id}
                          </div>
                          <div className="mt-1 text-[11px] text-white/40">
                            id {r.home_team_id} · {r.away_team_id}
                          </div>
                        </td>
                        <td className={td}>
                          <input
                            type="text"
                            inputMode="numeric"
                            value={
                              r.home_team_score === null
                                ? ""
                                : String(r.home_team_score)
                            }
                            onChange={(e) => {
                              const v = e.target.value.trim();
                              if (v === "") {
                                handleEditRowPatch(r.id, {
                                  home_team_score: null,
                                });
                                return;
                              }
                              const n = Number(v);
                              if (!Number.isFinite(n)) return;
                              handleEditRowPatch(r.id, {
                                home_team_score: n,
                              });
                            }}
                            className="w-full min-w-[56px] rounded-[8px] border border-white/15 bg-[#232323] px-2 py-1 text-[13px] text-white"
                          />
                        </td>
                        <td className={td}>
                          <input
                            type="text"
                            inputMode="numeric"
                            value={
                              r.away_team_score === null
                                ? ""
                                : String(r.away_team_score)
                            }
                            onChange={(e) => {
                              const v = e.target.value.trim();
                              if (v === "") {
                                handleEditRowPatch(r.id, {
                                  away_team_score: null,
                                });
                                return;
                              }
                              const n = Number(v);
                              if (!Number.isFinite(n)) return;
                              handleEditRowPatch(r.id, {
                                away_team_score: n,
                              });
                            }}
                            className="w-full min-w-[56px] rounded-[8px] border border-white/15 bg-[#232323] px-2 py-1 text-[13px] text-white"
                          />
                        </td>
                        <td className={td}>
                          <input
                            type="text"
                            value={r.status}
                            onChange={(e) =>
                              handleEditRowPatch(r.id, {
                                status: e.target.value,
                              })
                            }
                            className="w-full min-w-[100px] rounded-[8px] border border-white/15 bg-[#232323] px-2 py-1 text-[13px] text-white"
                          />
                        </td>
                        <td className={td}>
                          <select
                            value={String(r.stadium_id)}
                            onChange={(e) =>
                              handleEditRowPatch(r.id, {
                                stadium_id: Number(e.target.value),
                              })
                            }
                            className="w-full max-w-[200px] min-w-[120px] rounded-[8px] border border-white/15 bg-[#232323] px-2 py-1 text-[13px] text-white"
                          >
                            {sortedStadiums.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.name ?? `#${s.id}`}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className={td}>
                          <input
                            type="url"
                            placeholder="비우면 null"
                            value={r.youtube_url ?? ""}
                            onChange={(e) =>
                              handleEditRowPatch(r.id, {
                                youtube_url:
                                  e.target.value.trim() === ""
                                    ? null
                                    : e.target.value.trim(),
                              })
                            }
                            className="w-full max-w-[220px] min-w-[140px] rounded-[8px] border border-white/15 bg-[#232323] px-2 py-1 text-[12px] text-white"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleBatchEditSave}
                  disabled={
                    batchSaveEditMutation.isPending || editRows.length === 0
                  }
                  className="rounded-[12px] bg-violet-600/90 px-4 py-2 text-[14px] font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {batchSaveEditMutation.isPending ? "저장 중…" : "전체 저장"}
                </button>
                <span className="text-[11px] text-white/45">
                  {editRows.length}건 편집 중 · id·팀·경기일은 변경되지
                  않습니다.
                </span>
              </div>
            </>
          )}
        </section>

        <section className="rounded-[16px] border border-white/10 bg-white/4 p-4">
          <h2 className="mb-2 text-[15px] font-semibold text-white">
            5. TheSportsDB 경기 결과 (어제·오늘)
          </h2>
          <p className="mb-3 text-[12px] leading-relaxed text-white/50">
            페이지를 열면 TheSportsDB에서{" "}
            <span className="text-white/75">어제·오늘(KST) KBO 경기 결과</span>
            를 자동으로 불러옵니다. 날짜별로 확인 후 「저장」으로 DB에
            반영하세요. 동일 id는{" "}
            <span className="text-amber-200/90">upsert(덮어쓰기)</span>
            입니다.
          </p>
          <div className="mb-4 flex min-h-[36px] flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleTheSportsDbRefresh}
              disabled={theSportsDbFetchLoading}
              className="rounded-[12px] border border-white/20 bg-white/5 px-4 py-2 text-[14px] font-medium text-white/85 transition-opacity hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {theSportsDbFetchLoading ? "불러오는 중…" : "새로 고침"}
            </button>
            <span className="text-[11px] text-white/45">
              {theSportsDbResults ? (
                <>
                  어제 {theSportsDbResults.yesterdayKst} ·{" "}
                  {theSportsDbResults.yesterdayGames.length}경기 · 오늘{" "}
                  {theSportsDbResults.todayKst} ·{" "}
                  {theSportsDbResults.todayGames.length}경기
                  {theSportsDbFetchLoading ? " · 갱신 중…" : ""}
                </>
              ) : theSportsDbFetchLoading ? (
                "TheSportsDB 경기 결과 불러오는 중…"
              ) : (
                "경기 결과를 불러오지 못했습니다. 새로 고침해 주세요."
              )}
            </span>
          </div>
          {loadingTeams && theSportsDbResults != null && (
            <p className="mb-3 text-[13px] text-white/55">팀 목록 로딩…</p>
          )}
          {theSportsDbResults != null && !loadingTeams && (
            <div
              className={
                theSportsDbFetchLoading ? "space-y-6 opacity-70" : "space-y-6"
              }
            >
              <TheSportsDbDatePreviewBlock
                title={`어제 (${theSportsDbResults.yesterdayKst})`}
                rows={theSportsDbYesterdayPreviewRows}
                emptyMessage={`어제(${theSportsDbResults.yesterdayKst}) 조회된 KBO 경기가 없습니다.`}
                teamLabelById={teamLabelById}
                stadiumLabelById={stadiumLabelById}
                saveLabel={`어제(${theSportsDbResults.yesterdayKst}) 저장`}
                savePending={
                  applyTheSportsDbMutation.isPending &&
                  applyTheSportsDbMutation.variables?.label.startsWith("어제")
                }
                saveDisabled={
                  applyTheSportsDbMutation.isPending ||
                  theSportsDbFetchLoading ||
                  !theSportsDbYesterdayPreviewRows.some(
                    isValidTheSportsDbPreviewForInsert,
                  )
                }
                onSave={handleTheSportsDbSaveYesterday}
              />
              <TheSportsDbDatePreviewBlock
                title={`오늘 (${theSportsDbResults.todayKst})`}
                rows={theSportsDbTodayPreviewRows}
                emptyMessage={`오늘(${theSportsDbResults.todayKst}) 조회된 KBO 경기가 없습니다.`}
                teamLabelById={teamLabelById}
                stadiumLabelById={stadiumLabelById}
                saveLabel={`오늘(${theSportsDbResults.todayKst}) 저장`}
                savePending={
                  applyTheSportsDbMutation.isPending &&
                  applyTheSportsDbMutation.variables?.label.startsWith("오늘")
                }
                saveDisabled={
                  applyTheSportsDbMutation.isPending ||
                  theSportsDbFetchLoading ||
                  !theSportsDbTodayPreviewRows.some(
                    isValidTheSportsDbPreviewForInsert,
                  )
                }
                onSave={handleTheSportsDbSaveToday}
              />
            </div>
          )}
        </section>

        <section className="rounded-[16px] border border-white/10 bg-white/4 p-4">
          <h2 className="mb-2 text-[15px] font-semibold text-white">
            6. TheSportsDB 경기 결과 (날짜 지정)
          </h2>
          <p className="mb-3 text-[12px] leading-relaxed text-white/50">
            원하는{" "}
            <span className="text-white/75">경기 날짜(YYYY-MM-DD)</span>를
            고른 뒤 「조회」로 TheSportsDB 시즌 일정에서 해당일 KBO 경기를
            불러옵니다. 미리보기 확인 후 「저장」으로 DB에 반영하세요. status·
            점수·youtube 규칙은 5번과 동일합니다.
          </p>
          <div className="mb-4 flex min-h-[36px] flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-[13px] text-white/70">
              경기 날짜
              <input
                type="date"
                value={theSportsDbPickDate}
                onChange={(e) => handleTheSportsDbPickDateChange(e.target.value)}
                className="rounded-[8px] border border-white/15 bg-[#232323] px-2 py-1.5 text-[14px] text-white"
              />
            </label>
            <button
              type="button"
              onClick={() => void handleFetchTheSportsDbByDate()}
              disabled={theSportsDbPickLoading || !theSportsDbPickDate}
              className="rounded-[12px] border border-white/20 bg-white/5 px-4 py-2 text-[14px] font-medium text-white/85 transition-opacity hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {theSportsDbPickLoading ? "불러오는 중…" : "조회"}
            </button>
            <span className="text-[11px] text-white/45">
              {theSportsDbPickResults ? (
                <>
                  {theSportsDbPickResults.matchDate} ·{" "}
                  {theSportsDbPickResults.games.length}경기
                  {theSportsDbPickLoading ? " · 갱신 중…" : ""}
                </>
              ) : theSportsDbPickLoading ? (
                "TheSportsDB 경기 결과 불러오는 중…"
              ) : (
                "날짜를 선택하고 조회해 주세요."
              )}
            </span>
          </div>
          {loadingTeams && theSportsDbPickResults != null && (
            <p className="mb-3 text-[13px] text-white/55">팀 목록 로딩…</p>
          )}
          {theSportsDbPickResults != null && !loadingTeams && (
            <div
              className={
                theSportsDbPickLoading ? "space-y-6 opacity-70" : "space-y-6"
              }
            >
              <TheSportsDbDatePreviewBlock
                title={`${theSportsDbPickResults.matchDate}`}
                rows={theSportsDbPickPreviewRows}
                emptyMessage={`${theSportsDbPickResults.matchDate} 조회된 KBO 경기가 없습니다.`}
                teamLabelById={teamLabelById}
                stadiumLabelById={stadiumLabelById}
                saveLabel={`${theSportsDbPickResults.matchDate} 저장`}
                savePending={
                  applyTheSportsDbMutation.isPending &&
                  applyTheSportsDbMutation.variables?.label.startsWith(
                    "날짜 지정",
                  )
                }
                saveDisabled={
                  applyTheSportsDbMutation.isPending ||
                  theSportsDbPickLoading ||
                  !theSportsDbPickPreviewRows.some(
                    isValidTheSportsDbPreviewForInsert,
                  )
                }
                onSave={handleTheSportsDbSavePickDate}
              />
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

function pad2Display(n: number) {
  return String(n).padStart(2, "0");
}

/** 5·6번 — 날짜별 TheSportsDB 미리보기 테이블 + 저장 */
function TheSportsDbDatePreviewBlock({
  title,
  rows,
  emptyMessage,
  teamLabelById,
  stadiumLabelById,
  saveLabel,
  savePending,
  saveDisabled,
  onSave,
}: {
  title: string;
  rows: TheSportsDbPreviewRow[];
  emptyMessage: string;
  teamLabelById: Map<number, string>;
  /** 저장은 stadium_id 숫자, 테이블에는 구장명 표시용 */
  stadiumLabelById: Map<number, string>;
  saveLabel: string;
  savePending: boolean;
  saveDisabled: boolean;
  onSave: () => void;
}) {
  return (
    <div>
      <h3 className="mb-2 text-[14px] font-medium text-white/90">{title}</h3>
      {rows.length === 0 ? (
        <p className="mb-3 text-[13px] text-white/55">{emptyMessage}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className={`${dbTableShell} min-w-[960px]`}>
            <thead>
              <tr>
                <th className={th}>id</th>
                <th className={th}>홈·원정</th>
                <th className={th}>홈 점수</th>
                <th className={th}>원정 점수</th>
                <th className={th}>status</th>
                <th className={th}>경기장</th>
                <th className={th}>youtube</th>
                <th className={th}>seq</th>
                <th className={th}>비고</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.idEvent}>
                  <td className={`${td} font-mono text-[11px]`}>
                    {row.id || "—"}
                  </td>
                  <td className={td}>
                    <div>
                      {row.homeTeamId != null
                        ? (teamLabelById.get(row.homeTeamId) ?? row.homeTeamId)
                        : row.homeTeamName}{" "}
                      vs{" "}
                      {row.awayTeamId != null
                        ? (teamLabelById.get(row.awayTeamId) ?? row.awayTeamId)
                        : row.awayTeamName}
                    </div>
                    <div className="mt-1 text-[11px] text-white/40">
                      id {row.homeTeamId ?? "?"} · {row.awayTeamId ?? "?"}
                    </div>
                  </td>
                  <td className={td}>{formatPreviewScore(row.homeScore)}</td>
                  <td className={td}>{formatPreviewScore(row.awayScore)}</td>
                  <td className={td}>{row.status}</td>
                  <td className={td}>
                    {row.stadiumId != null ? (
                      <>
                        <div>
                          {stadiumLabelById.get(row.stadiumId) ?? row.stadiumId}
                        </div>
                        <div className="mt-1 text-[11px] text-white/40">
                          id {row.stadiumId}
                        </div>
                      </>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className={`${td} max-w-[120px] truncate`}>
                    {row.youtubeUrl ?? "—"}
                  </td>
                  <td className={td}>{pad2Display(row.sequence)}</td>
                  <td className={td}>
                    {row.issues.length > 0 ? (
                      <ul className="list-inside list-disc text-amber-200/90">
                        {row.issues.map((m) => (
                          <li key={m}>{m}</li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-white/35">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onSave}
          disabled={saveDisabled}
          className="rounded-[12px] bg-emerald-600/90 px-4 py-2 text-[14px] font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {savePending ? "저장 중…" : saveLabel}
        </button>
        <span className="text-[11px] text-white/45">
          비고(매핑 오류)가 있는 행은 제외됩니다.
        </span>
      </div>
    </div>
  );
}

function isValidPreviewForInsert(row: PreviewRow): boolean {
  return (
    !!row.id &&
    row.homeTeamId != null &&
    row.awayTeamId != null &&
    row.stadiumId != null &&
    row.issues.length === 0
  );
}

export default GameRecordsPage;
