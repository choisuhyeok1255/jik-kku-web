DROP VIEW IF EXISTS public.user_win_stats;

CREATE VIEW public.user_win_stats AS
SELECT
  u.id AS user_id,
  u.nickname,
  u.avatar,
  count(*)::integer AS total_games,
  count(*) FILTER (WHERE gl.home_team_score > gl.away_team_score)::integer AS wins,
  count(*) FILTER (WHERE gl.home_team_score < gl.away_team_score)::integer AS losses,
  count(*) FILTER (WHERE gl.home_team_score = gl.away_team_score)::integer AS draws,
  round(
    100.0 * count(*) FILTER (WHERE gl.home_team_score > gl.away_team_score)::numeric
      / NULLIF(count(*), 0)::numeric,
    2
  )::numeric(5, 2) AS win_rate
FROM users u
JOIN game_logs gl ON gl.user_id = u.id AND gl.is_certified = true
GROUP BY u.id, u.nickname, u.avatar;
