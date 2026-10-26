# Skivu Device Control

Independent Android phone-control plugin for Skivu. The plugin owns its task UI and ships separately from the host APK; actual device input is provided by a separately installed, manually paired [device companion](https://github.com/skyjjgw/skivu-device-bridge).

**Development preview.** Released Skivu build44 does not expose the new task methods. The host integration is developed on `feature/device-control-20261026`; availability must be checked with `host.info`. The package requires the eventual compatible host (provisional minimum 0.2.42). Do not advertise this as already activated in the public market.

## Implemented

- Companion discovery, Android caller approval and per-plugin connection ownership.
- Explicit app selection and task consent, bounded model/action/time budgets.
- Real UI-tree observation, launch, node input, taps and scrolling through the companion.
- Asynchronous task state, notification stop control and no automatic replay after uncertain execution.
- Separate task planning through the host's existing account/beta/custom-model transport. The plugin receives no host credentials.

This initial version plans from **text UI trees**. Screenshot-based model planning and downloadable application-specific workflows remain later milestones. Android OEM behavior and real model success rates need their own tests; mock planning is never counted as real-model validation.

## Build

```sh
npm test
python tools/build_web_plugin.py src --output packages/device-control-0.1.0.skivu.json
python tools/build_web_plugin.py --check packages/device-control-0.1.0.skivu.json
```

The build tool is derived from the GPL-3.0 Skivu SDK builder. Assets and package serialization are deterministic. Installing the package does not grant accessibility; the user must install and authorize the companion and approve each task.

## Source and distribution

Personal primary: https://github.com/skyjjgw/skivu-device-control

Organization copy: https://github.com/Skymoni-Labs/skivu-device-control

GPL-3.0-only. Keep server operation scripts, credentials, actual account information and user screen logs out of this repository.
