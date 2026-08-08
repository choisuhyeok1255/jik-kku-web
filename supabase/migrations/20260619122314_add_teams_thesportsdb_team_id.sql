-- TheSportsDB idTeam — livescore API의 idHomeTeam/idAwayTeam 매칭용
ALTER TABLE public.teams
  ADD COLUMN thesportsdb_team_id text;

COMMENT ON COLUMN public.teams.thesportsdb_team_id
  IS 'TheSportsDB idTeam — livescore API의 idHomeTeam/idAwayTeam 매칭용';

UPDATE public.teams SET thesportsdb_team_id = '139825' WHERE id = 1;
UPDATE public.teams SET thesportsdb_team_id = '139820' WHERE id = 2;
UPDATE public.teams SET thesportsdb_team_id = '139826' WHERE id = 3;
UPDATE public.teams SET thesportsdb_team_id = '139819' WHERE id = 4;
UPDATE public.teams SET thesportsdb_team_id = '139827' WHERE id = 5;
UPDATE public.teams SET thesportsdb_team_id = '139821' WHERE id = 6;
UPDATE public.teams SET thesportsdb_team_id = '139824' WHERE id = 7;
UPDATE public.teams SET thesportsdb_team_id = '139822' WHERE id = 8;
UPDATE public.teams SET thesportsdb_team_id = '139823' WHERE id = 9;
UPDATE public.teams SET thesportsdb_team_id = '139828' WHERE id = 10;

ALTER TABLE public.teams
  ADD CONSTRAINT teams_thesportsdb_team_id_key UNIQUE (thesportsdb_team_id);

ALTER TABLE public.teams
  ALTER COLUMN thesportsdb_team_id SET NOT NULL;
