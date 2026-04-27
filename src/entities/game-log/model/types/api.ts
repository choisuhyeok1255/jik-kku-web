import { Database } from "@/src/shared";

export interface CreateGameLogQueryModel {
  body: Database["public"]["Tables"]["game_logs"]["Insert"];
}

export type UpdateGameLogQueryModel = {
  query: { gameLogId: Database["public"]["Tables"]["game_logs"]["Row"]["id"] };
  body: Database["public"]["Tables"]["game_logs"]["Update"];
};

export type GameLogServerModel =
  Database["public"]["Tables"]["game_logs"]["Row"];

export interface GetGameLogsQueryModel {
  query: { userId: Database["public"]["Tables"]["users"]["Row"]["id"] };
}

export interface GetGameLogsInfiniteQueryModel {
  query: {
    userId: Database["public"]["Tables"]["users"]["Row"]["id"];
    pageSize?: number;
  };
}

export interface GetGameLogDetailQueryModel {
  query: { gameLogId: Database["public"]["Tables"]["game_logs"]["Row"]["id"] };
}

export interface DeleteGameLogQueryModel {
  query: { gameLogId: Database["public"]["Tables"]["game_logs"]["Row"]["id"] };
}
