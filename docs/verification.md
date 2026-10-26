# Device control preview verification

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
| Host tests after stable build45 source integration | 427 passed; static analysis clean |
| Companion JVM tests | 72 passed |
| Plugin Node tests | 8 passed |
| Notification stop / companion-local revoke while planning | Cancelled, no subsequent input |
| 0.1.1 role short runtime | CAS draft + prepared card; no device calls |
| 0.1.1 card page | Correct role/chat draft loaded; task still not started |

Only observations explicitly rejected as **not executed** may trigger a fresh observation and a new plan. Unknown execution results stop for reconciliation; they are never automatically replayed. Returning from the local approval screen waits for the app transition and still validates the original target.

The full device-input flow was verified with0.1.0, including the separately signed companion APK. Version0.1.1 adds the short-runtime/card flow, verified separately on the same isolated device. Role isolation, superseded cards and CAS conflicts also have Node tests.

The public package requires compatible host **0.2.42 / build46**. Host integration is on a feature branch with a separately installable normal-entrypoint preview; it is not activated in the public update catalog. SDK1.0 compatibility alone does not provide the new methods. Check `host.info` before use.

Not yet verified: real LLM end-to-end performance, physical devices/OEM background restrictions and other Android versions. Screenshot-model planning, pause/resume and app-specific task recipes remain unimplemented. Text trees cannot expose every custom-drawn control. Local sensitive-label detection is a heuristic; explicit scope and user intent remain necessary.
