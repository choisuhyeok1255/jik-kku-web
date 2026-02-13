import { Database } from "@/src/shared";

export interface CreateGameLogQueryModel {
  body: Database["public"]["Tables"]["game_logs"]["Insert"];
}

export type UpdateGameLogQueryModel = {
  query: { gameLogId: Database["public"]["Tables"]["game_logs"]["Row"]["id"] };
  body: Database["public"]["Tables"]["game_logs"]["Update"];
};

export interface CertifyGameLogQueryModel {
  query: { gameLogId: Database["public"]["Tables"]["game_logs"]["Row"]["id"] };
}

export type GameLogServerModel =
  Database["public"]["Tables"]["game_logs"]["Row"];

export interface GetGameLogsQueryModel {
  query: { userId: Database["public"]["Tables"]["users"]["Row"]["id"] };
}

export interface GetNotCertifyGameLogsQueryModel {
  query: { userId: Database["public"]["Tables"]["users"]["Row"]["id"] };
}

export type GetNotCertifyGameLogsServerModel =
  Database["public"]["Tables"]["game_logs"]["Row"];

export interface GetCertifyGameLogsQueryModel {
  query: { userId: Database["public"]["Tables"]["users"]["Row"]["id"] };
}

export type GetCertifyGameLogsServerModel = GetNotCertifyGameLogsServerModel;

export interface GetGameLogDetailQueryModel {
  query: { gameLogId: Database["public"]["Tables"]["game_logs"]["Row"]["id"] };
}

export interface DeleteGameLogQueryModel {
  query: { gameLogId: Database["public"]["Tables"]["game_logs"]["Row"]["id"] };
}
