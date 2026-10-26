# 0.1.0 preview verification

Verified on 2026-10-26 using an isolated Android API36 emulator. This is real Android input through the independent companion, with **fixed in-process planning**, not a real-model success-rate test.

The independently downloaded Web package was imported into the candidate host, enabled through normal plugin consent, and connected through the public SDK methods. The host showed a task consent naming the selected test app, model and budgets. The companion launched the test notes app, entered Chinese text, tapped Save, and returned the saved text as completion evidence: **3 actions, 3 planning rounds**.

| Check | Result |
|---|---|
| Plugin → host SDK → Android IPC → real notes UI | Passed |
| Launch/read outside selected package | `APP_OUT_OF_SCOPE` |
| Wrong task capability | `TASK_REVOKED` |
| Password input | `LOCAL_INPUT_REQUIRED` |
| Sensitive button before local approval | `CONFIRM_REQUIRED` |
| Same sensitive button after local approval | One execution, read-back count 1 |
| Host tests | 413 passed; static analysis clean |
| Companion JVM tests | 72 passed |
| Plugin Node tests | 4 passed |

Only observations explicitly rejected as **not executed** may trigger a fresh observation and a new plan. Unknown execution results stop for reconciliation; they are never automatically replayed. Returning from the local approval screen waits for the app transition and still validates the original target.

The public package requires compatible host **0.2.42 / build46 or later**. At the time of this preview, host integration is on a feature branch and is not activated in the public update catalog. SDK1.0 compatibility alone does not provide the new methods. Check `host.info` before use.

Not yet verified: real LLM end-to-end performance, physical devices/OEM background restrictions, screenshot-model planning, app-specific task recipes and role-chat task preparation. Text trees cannot expose every custom-drawn control. Local sensitive-label detection is a heuristic; explicit scope and user intent remain necessary.
