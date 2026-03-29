import { describe, it, expect } from "vitest";
import type { GameLogServerModel } from "@/src/entities";
import type { CreateGameLogForm } from "../model/types/form";
import { transformFormToApiBody, transformApiToGameLogForm } from "./parser";

describe("transformFormToApiBody", () => {
  it("모든 필드가 있을 때 올바르게 변환해야 함", () => {
    const formData: Omit<CreateGameLogForm, "gameLogImage"> = {
      homeTeamId: 1,
      awayTeamId: 2,
      homeTeamScore: 3,
      awayTeamScore: 2,
      matchDate: "2024-01-01",
      stadiumId: 5,
      note: "재밌는 경기",
      youtubeUrl: null,
    };

    const result = transformFormToApiBody({ userId: "user-123", formData });

    expect(result).toEqual({
      user_id: "user-123",
      home_team_id: 1,
      away_team_id: 2,
      home_team_score: 3,
      away_team_score: 2,
      match_date: "2024-01-01",
      stadium_id: 5,
      note: "재밌는 경기",
      youtube_url: null,
      support_team_id: 1,
      game_log_images: [],
      is_private: false,
      game_record_id: null,
    });
  });

  it("이미지가 있으면 game_log_image를 포함해야 함", () => {
    const formData: Omit<CreateGameLogForm, "gameLogImage"> = {
      homeTeamId: 1,
      awayTeamId: 2,
      homeTeamScore: 3,
      awayTeamScore: 2,
      matchDate: "2024-01-01",
      stadiumId: 5,
      note: "",
      youtubeUrl: null,
    };

    const result = transformFormToApiBody({
      userId: "user-123",
      formData,
      gameLogImage: "image/path.jpg",
    });

    expect(result.game_log_image).toBe("image/path.jpg");
  });

  it("이미지가 없으면 game_log_image를 포함하지 않아야 함", () => {
    const formData: Omit<CreateGameLogForm, "gameLogImage"> = {
      homeTeamId: 1,
      awayTeamId: 2,
      homeTeamScore: 3,
      awayTeamScore: 2,
      matchDate: "2024-01-01",
      stadiumId: 5,
      note: "",
      youtubeUrl: null,
    };

    const result = transformFormToApiBody({ userId: "user-123", formData });

    expect(result.game_log_image).toBeUndefined();
  });

  it("isCertified가 true이면 is_certified를 포함해야 함", () => {
    const formData: Omit<CreateGameLogForm, "gameLogImage"> = {
      homeTeamId: 1,
      awayTeamId: 2,
      homeTeamScore: 3,
      awayTeamScore: 2,
      matchDate: "2024-01-01",
      stadiumId: 5,
      note: "",
      youtubeUrl: null,
    };

    const result = transformFormToApiBody({
      userId: "user-123",
      formData,
      isCertified: true,
    });

    expect(result.is_certified).toBe(true);
  });

  it("gameLogImageThumbnail이 있으면 game_log_image_thumbnail을 포함해야 함", () => {
    const formData: Omit<CreateGameLogForm, "gameLogImage"> = {
      homeTeamId: 1,
      awayTeamId: 2,
      homeTeamScore: 3,
      awayTeamScore: 2,
      matchDate: "2024-01-01",
      stadiumId: 5,
      note: "",
      youtubeUrl: null,
    };

    const result = transformFormToApiBody({
      userId: "user-123",
      formData,
      gameLogImageThumbnail: "thumbnail/path.jpg",
    });

    expect(result.game_log_image_thumbnail).toBe("thumbnail/path.jpg");
  });
});

describe("transformApiToGameLogForm", () => {
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
      note: "재밌는 경기",
      game_log_image: "image.jpg",
      game_log_image_thumbnail: "thumbnail.jpg",
      game_log_images: [],
      game_record_id: null,
      is_certified: false,
      is_admin_certified: false,
      is_private: false,
      support_team_id: 1,
      youtube_url: null,
      created_at: "2024-01-01T00:00:00Z",
    };

    const result = transformApiToGameLogForm(apiData);

    expect(result).toEqual({
      stadiumId: 5,
      homeTeamId: 1,
      awayTeamId: 2,
      homeTeamScore: 3,
      awayTeamScore: 2,
      matchDate: "2024-01-01",
      note: "재밌는 경기",
      gameLogImage: "thumbnail.jpg",
      youtubeUrl: null,
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
      stadium_id: 5,
      note: null,
      game_log_image: null,
      game_log_image_thumbnail: null,
      game_log_images: [],
      game_record_id: null,
      is_certified: false,
      is_admin_certified: false,
      is_private: false,
      support_team_id: 1,
      youtube_url: null,
      created_at: "2024-01-01T00:00:00Z",
    };

    const result = transformApiToGameLogForm(apiData);

    expect(result.note).toBe("");
    expect(result.gameLogImage).toBeNull();
  });
});
