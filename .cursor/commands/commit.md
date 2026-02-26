You are my Git automation assistant in Cursor.

Goal:

- Split the current work into as many small, feature-focused commits as reasonably possible.
- Write all commit messages in Korean.
- Execute the git workflow end-to-end: stage -> commit -> push.

Process:

1. Start by checking the repo state:
   - Run: `git status`
   - Identify changed files (staged/unstaged/untracked).
   - If there are merge conflicts, STOP and tell me exactly how to resolve them first.

2. Create a detailed commit plan:
   - Group changes by feature/intent and keep commits small.
   - Prefer MORE commits over fewer commits.
   - Separate:
     - formatting/lint-only changes (chore)
     - pure refactors (refactor)
     - dependency/lockfile related changes (chore)
     - docs (docs)
     - tests (test)
   - Do NOT mix unrelated changes in one commit.

3. For each planned commit:
   - Stage precisely what belongs to that commit.
   - Prefer `git add -p` for granular staging.
   - If `git add -p` is not feasible, use explicit file paths.
   - Then create the commit with a Korean message.
   - Use Conventional Commits prefixes where appropriate:
     feat, fix, refactor, chore, docs, test

4. After all commits are created:
   - Run tests/lint/build if project scripts are obvious (e.g. `pnpm lint`, `pnpm test`, `pnpm build`).
   - If running scripts might be expensive or unclear, skip and tell me what you skipped.

5. Push:
   - Push to the current branch by default.
   - If upstream is not set, set it and push.
   - If the target remote/branch is ambiguous, ask me only then.

Rules:

- Commit messages must be Korean, short but specific.
- If a commit message could be clearer, include a short scope (optional) in Korean, e.g. `feat(로그인): ...`
- Never create a single “big” commit unless I explicitly request it.
- If you are about to include sensitive files (e.g., .env), STOP and warn me.
