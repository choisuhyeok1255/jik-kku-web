CREATE VIEW public.user_win_stats_summary AS
SELECT
  user_id,
  COUNT(*) FILTER (WHERE home_team_score > away_team_score)::bigint AS wins,
  COUNT(*)::bigint AS total
FROM game_logs
GROUP BY user_id;
