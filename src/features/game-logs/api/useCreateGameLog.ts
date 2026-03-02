import { useQueryClient } from "@tanstack/react-query";

import {
  usePostGameLog,
  CreateGameLogQueryModel,
  userWinStatsKeys,
} from "@/src/entities";

export const useCreateGameLog = () => {
  const queryClient = useQueryClient();
  const { mutate: postGameLog, ...rest } = usePostGameLog();

  const createGameLog = (
    req: CreateGameLogQueryModel,
    options?: Parameters<typeof postGameLog>[1],
  ) => {
    postGameLog(req, {
      ...options,
      onSuccess: (...args) => {
        queryClient.invalidateQueries({
          queryKey: userWinStatsKeys.rankingAll(),
        });
        options?.onSuccess?.(...args);
      },
    });
  };

  return {
    ...rest,
    mutate: createGameLog,
  };
};
