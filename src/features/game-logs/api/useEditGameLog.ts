import { useQueryClient } from "@tanstack/react-query";

import {
  useUpdateGameLog,
  UpdateGameLogQueryModel,
  userWinStatsKeys,
} from "@/src/entities";

export const useEditGameLog = () => {
  const queryClient = useQueryClient();
  const { mutate: updateGameLog, ...rest } = useUpdateGameLog();

  const editGameLog = (
    req: UpdateGameLogQueryModel,
    options?: Parameters<typeof updateGameLog>[1],
  ) => {
    updateGameLog(req, {
      ...options,
      onSuccess: (...args) => {
        queryClient.invalidateQueries({
          queryKey: userWinStatsKeys.ranking(),
        });
        options?.onSuccess?.(...args);
      },
    });
  };

  return {
    ...rest,
    mutate: editGameLog,
  };
};
