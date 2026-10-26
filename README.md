# Skivu Device Control

Independent Android phone-control plugin for Skivu. The plugin owns its task UI and ships separately from the host APK; actual device input is provided by a separately installed, manually paired [device companion](https://github.com/skyjjgw/skivu-device-bridge).

**Development preview.** Ordinary build44/45 does not expose the new device-task methods. Build the [host feature branch](https://github.com/skyjjgw/skivu/tree/feature/device-control-20261026) using the separate-preview flag described in the setup guide. This is not activated in the public market/update channel. The package requires compatible host0.2.42 and checks `host.info`. A compiled host preview was verified locally; its binary is not published on GitHub.

[中文安装与使用](docs/getting-started.zh-CN.md) · [Verification and limits](docs/verification.md)

## Implemented

- Companion discovery, Android caller approval and per-plugin connection ownership.
- Explicit app selection, one-time direct-control trust and bounded model/action/time budgets.
- Real UI-tree observation, launch, node input, taps and scrolling through the companion.
- Asynchronous task state, notification stop control and no automatic replay after uncertain execution.
- Separate task planning through the host's existing account/beta/custom-model transport. The plugin receives no host credentials.
- Optional role-chat `prepare_task` tool: CAS-save a role/chat-scoped draft, return a card, then open the foreground plugin to review and start. The short tool never reads or operates the phone.
- Version0.2 remembers the selected companion and app, pins its signing fingerprint, restores only that identity, and exposes model source and task budgets before Start. Reopening never restarts a task.

This initial version plans from **text UI trees**. Screenshot-based model planning and downloadable application-specific workflows remain later milestones. Android OEM behavior and real model success rates need their own tests; mock planning is never counted as real-model validation.

## Build

```sh
npm test
python tools/build_web_plugin.py src --output packages/device-control-0.2.0.skivu.json
python tools/build_web_plugin.py --check packages/device-control-0.2.0.skivu.json
```

The build tool is derived from the GPL-3.0 Skivu SDK builder. Assets and package serialization are deterministic. Installing the package does not grant accessibility. Enable the plugin's explicit `device.direct` permission and locally trust the controller in the companion once; connecting, starting and in-task clicks then need no repeated confirmation. Legacy grants stay in confirmation mode until explicitly changed. Password input and Android system grants remain local. Disable the plugin or revoke trust in the companion to stop access.

## Source and distribution

Personal primary: https://github.com/skyjjgw/skivu-device-control

Organization copy: https://github.com/Skymoni-Labs/skivu-device-control

GPL-3.0-only. Keep server operation scripts, credentials, actual account information and user screen logs out of this repository.
