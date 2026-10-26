# 0.2.0 verification — 2026-10-27

This is a development preview for the host device-control branch (candidate0.2.42/build46), not an activated production update. No real test account or model was available. Device planning below is fixed in-process test logic; Android IPC, UI observation and input are real.

| Executed layer | Actual result |
|---|---|
| Host unit/widget tests in GitHub CI | 441 passed, separately from Android end-to-end tests |
| Host JavaScript SDK tests | 39 passed |
| Independent plugin Node tests | 14 passed |
| Companion JVM tests | 73 passed; Android builds and Lint completed |
| Normal Android16 and Android11 entrypoints | 18 routes, role create/edit, model validation/save, closed-loopback connection failure and duplicate-send protection passed |
| Fresh Android processes on both versions | Role, model, synthetic secure key and history restored |
| Android11 native secure storage | UI model create/select/edit/delete and replaced/deleted key erasure passed; synthetic role deletion preserved other roles |
| Android11 system file picker | Real JSON import twice; disabled by default, explicit enable, disable, update reset with data retention and erase-on-uninstall passed |
| Android16 multi-app SDK task | 20 actions / 20 rounds across test notes, Settings and empty Contacts; final saved Chinese text read back |
| Android16 and Android11 direct control | Once-trusted client, actual sensitive test button and read-back count1; final Android11 rapid double Start executed once |
| Android16 stop/revoke/process recovery | Notification Stop, out-of-scope waiting, local trust revocation, completed receipt/profile recovery and interrupted-process reconciliation passed |
| Android11 companion termination | `DEVICE_DISCONNECTED`, `review_required`, no subsequent input |
| Android16 native boundaries | Foreign launch/read, wrong capability and password input rejected; legacy confirmation mode executed once only after approval |
| Android16 and Android11 short role tool | Direct test invocation prepared a CAS draft/card without device or model capabilities; not a test of LLM tool selection |

Android11's initial WebView83 exposed missing `replaceChildren`, `crypto.randomUUID` and top-level-await support. The package now uses compatible DOM operations, secure `getRandomValues` UUID fallback and an asynchronous readiness call. The corrected package was executed on that original WebView; no browser upgrade was used to conceal compatibility failures.

Android11 SwiftShader software rendering produced a dark glass composer with Impeller validation errors. The same freshly installed release APK rendered correctly using the host NVIDIA GPU; core flows were rerun in that configuration. Software-renderer compatibility remains a known limit, and physical/OEM graphics/background behavior is unverified.

The product UI selects one app per task. The three-app test used the public SDK with an explicit three-package scope; it does not imply a multi-app selection UI. Reopening never restarts a task. Only terminal, explicitly non-executed stale rejections permit a fresh observation and plan. Unknown outcomes require reconciliation. Short-runtime limits remain4 rounds/4 calls/45 seconds.

Not verified: real account login/expiry/roles, real model performance, production billing or duplicate charges, actual official-update installation, physical devices/OEM power limits and real microphone/camera services. Screenshot-model planning and pause/resume remain unimplemented. These results support controlled preview testing, not a claim of complete production acceptance.

Personal/organization CI and source: [host](https://github.com/skyjjgw/skivu/actions) / [host copy](https://github.com/Skymoni-Labs/skivu/actions), [plugin](https://github.com/skyjjgw/skivu-device-control/actions) / [plugin copy](https://github.com/Skymoni-Labs/skivu-device-control/actions), [companion](https://github.com/skyjjgw/skivu-device-bridge/actions) / [companion copy](https://github.com/Skymoni-Labs/skivu-device-bridge/actions). The personal repositories remain primary.

<details><summary>Historical0.1 preview record (2026-10-26; superseded by the0.2 record above)</summary>

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

</details>
