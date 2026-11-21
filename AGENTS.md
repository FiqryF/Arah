# ARAH — Adaptive Recovery & Achievement Hub

Stay Productive, Stay Human. TECHCOMFEST 2027, Smart Lifestyle & Digital Wellbeing.

- Inspect existing files and instructions before editing. Preserve existing work.
- Use available relevant skills; read their instructions and report actual usage. Never invent skills.
- Follow inspect → plan → implement → verify → review → report.
- Approved stack: React, TypeScript, Vite, Tailwind, React Router, Lucide; Python 3.12+, FastAPI, Pydantic v2, SQLAlchemy 2, Alembic, PostgreSQL. No Next.js, PHP, Laravel, or MongoDB.
- Monorepo modular monolith: frontend feature folders, backend versioned API and module boundaries. Keep architecture simple for two developers.
- Phase 2 covers foundation only; implement later modules only when requested. Phase 1 ERD has 22 unique tables; consult its source before extending the schema.
- Roles are exactly user/admin. Public registration must default to user. Enforce authorization in the backend; admin status never implies access to private wellbeing data. Placeholder routes are not authentication.
- Keep secrets out of Git, frontend variables, logs, and error responses. Validate input. Use database constraints, UUID keys, foreign keys and timezone-aware timestamps.
- Mobile-first responsive, accessible light/dark glass styling; Indonesian and English.
- Default user timezone: Asia/Jakarta. Store instants as timestamptz and use UTC PostgreSQL sessions; convert only for user presentation. Never replace timezone-aware columns with naive local timestamps.
- Final Phase 1 image mapping is in docs/database/PHASE_1_ERD_REFERENCE.md. Distinguish visible PK/FK/NN/unique markers from unspecified defaults, varchar lengths, numeric precision, and composite constraints. Preserve applied migration history; use new migrations for confirmed schema changes.
- Run relevant automated tests, real integration checks and migration checks. Never fake connectivity, results, file creation, or completion.
- Every significant task needs exactly one consolidated Bahasa Indonesia Markdown report in docs/reports/. Phase 2: PHASE_2_IMPLEMENTATION_REPORT.md. Include information, summary, actual skills, work, file changes, dependencies, database, APIs, test evidence, errors/fixes, security/quality, unfinished work, definition of done, final status, next steps. Test statuses: PASS/FAIL/BLOCKED/NOT RUN. Final status: COMPLETED/PARTIALLY COMPLETED/BLOCKED.
