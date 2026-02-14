import { describe, it, expect } from "vitest";
import { transformFormToApiBody, transformApiToForm } from "./parser";
import type { GameLogServerModel } from "../model/types/api";
import type { CreateGameLogForm } from "../model/types/form";

describe("transformFormToApiBody", () => {
  it("모든 필드가 있을 때 올바르게 변환해야 함", () => {
    const formData: Omit<CreateGameLogForm, "gameLogImage"> = {
      homeTeamId: 1,
      awayTeamId: 2,
      homeTeamScore: 3,
      awayTeamScore: 2,
      matchDate: "2024-01-01",
      stadiumId: 5,
      companion: "친구",
      mvp: "홍길동",
      note: "재밌는 경기",
      weather: "1",
    };

    const result = transformFormToApiBody("user-123", formData);

    expect(result).toEqual({
      user_id: "user-123",
      home_team_id: 1,
      away_team_id: 2,
      home_team_score: 3,
      away_team_score: 2,
      match_date: "2024-01-01",
      stadium_id: 5,
      companion: "친구",
      mvp: "홍길동",
      note: "재밌는 경기",
      weather: 1,
      is_certify: false,
    });
  });

  it("필수 필드가 없으면 에러를 던져야 함", () => {
    const invalidFormData = {
      homeTeamId: null,
      awayTeamId: 2,
      homeTeamScore: 3,
      awayTeamScore: 2,
      matchDate: null, // 필수 필드 누락
      stadiumId: null,
      companion: "",
      mvp: "",
      note: "",
      weather: null,
    };

    expect(() => {
      transformFormToApiBody("user-123", invalidFormData);
    }).toThrow("Invalid form data");
  });

  it("이미지가 있으면 game_log_image를 포함해야 함", () => {
    const formData: Omit<CreateGameLogForm, "gameLogImage"> = {
      homeTeamId: 1,
      awayTeamId: 2,
      homeTeamScore: 3,
      awayTeamScore: 2,
      matchDate: "2024-01-01",
      stadiumId: null,
      companion: "",
      mvp: "",
      note: "",
      weather: null,
    };

    const result = transformFormToApiBody(
      "user-123",
      formData,
      "image/path.jpg"
    );

    expect(result.game_log_image).toBe("image/path.jpg");
  });

  it("이미지가 없으면 game_log_image를 포함하지 않아야 함", () => {
    const formData: Omit<CreateGameLogForm, "gameLogImage"> = {
      homeTeamId: 1,
      awayTeamId: 2,
      homeTeamScore: 3,
      awayTeamScore: 2,
      matchDate: "2024-01-01",
      stadiumId: null,
      companion: "",
      mvp: "",
      note: "",
      weather: null,
    };

    const result = transformFormToApiBody("user-123", formData);

    expect(result.game_log_image).toBeUndefined();
  });

  it("weather가 없으면 weather 필드를 포함하지 않아야 함", () => {
    const formData: Omit<CreateGameLogForm, "gameLogImage"> = {
      homeTeamId: 1,
      awayTeamId: 2,
      homeTeamScore: 3,
      awayTeamScore: 2,
      matchDate: "2024-01-01",
      stadiumId: null,
      companion: "",
      mvp: "",
      note: "",
      weather: null,
    };

    const result = transformFormToApiBody("user-123", formData);

    expect(result.weather).toBeUndefined();
  });

  it("weather가 있으면 weather 필드를 포함해야 함", () => {
    const formData: Omit<CreateGameLogForm, "gameLogImage"> = {
      homeTeamId: 1,
      awayTeamId: 2,
      homeTeamScore: 3,
      awayTeamScore: 2,
      matchDate: "2024-01-01",
      stadiumId: null,
      companion: "",
      mvp: "",
      note: "",
      weather: "2",
    };

    const result = transformFormToApiBody("user-123", formData);

    expect(result.weather).toBe(2);
  });
});

describe("transformApiToForm", () => {
  it("API 데이터를 폼 데이터로 올바르게 변환해야 함", () => {
    const apiData: GameLogServerModel = {
      id: 1,
      user_id: "user-123",
      home_team_id: 1,
      away_team_id: 2,
      home_team_score: 3,
      away_team_score: 2,
      match_date: "2024-01-01",
      stadium_id: 5,
      companion: "친구",
      mvp: "홍길동",
      note: "재밌는 경기",
      weather: 1,
      game_log_image: "image.jpg",
      is_certify: false,
      created_at: "2024-01-01T00:00:00Z",
    };

    const result = transformApiToForm(apiData);

    expect(result).toEqual({
      stadiumId: 5,
      homeTeamId: 1,
      awayTeamId: 2,
      homeTeamScore: 3,
      awayTeamScore: 2,
      matchDate: "2024-01-01",
      companion: "친구",
      mvp: "홍길동",
      note: "재밌는 경기",
      weather: "1",
      gameLogImage: "image.jpg",
    });
  });

  it("null 값은 빈 문자열로 변환해야 함", () => {
    const apiData: GameLogServerModel = {
      id: 1,
      user_id: "user-123",
      home_team_id: 1,
      away_team_id: 2,
      home_team_score: 3,
      away_team_score: 2,
      match_date: "2024-01-01",
      stadium_id: null,
      companion: null,
      mvp: null,
      note: null,
      weather: null,
      game_log_image: null,
      is_certify: false,
      created_at: "2024-01-01T00:00:00Z",
    };

    const result = transformApiToForm(apiData);

    expect(result.companion).toBe("");
    expect(result.mvp).toBe("");
    expect(result.note).toBe("");
    expect(result.weather).toBeNull();
    expect(result.gameLogImage).toBeNull();
  });
});
