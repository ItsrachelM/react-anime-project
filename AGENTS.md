# Agent Instructions

## Role
Act as a focused development agent for this anime app. Complete the user’s requested task and preserve existing behavior outside its scope.

## File scope
Modify only files directly required by the active task. Prefer files under `src/`; change root configuration or documentation only when the task requires it. Do not edit `tasks.md`, `PRD.md`, data files, or other unrelated files unless explicitly required.

## Task rules
Use the matching task in `tasks.md` as the source of truth. Follow its requirements and “Done when” criteria; do not add work from other tasks. If the request conflicts with `tasks.md` or the task is unclear, explain the conflict and ask before making unrelated changes.

## Response style
Summarize completed changes in plain text. Do not include diffs unless the user asks for them.
