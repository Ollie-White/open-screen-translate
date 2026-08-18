# OpenScreen Translate

An original, Apache-2.0-licensed, offline-first screen translation MVP for **Windows and Linux**. It is a clean-room project: it shares only general user-facing capabilities with other screen translators and contains no copied code, branding, UI, text, binaries, or reverse engineering.

## What works

- The user clicks **Choose screen/window**, selects a desktop source, and explicitly captures it.
- Tesseract.js runs OCR locally on one current frame.
- A local glossary provider translates a small English → Spanish/French vocabulary with no API key or network request.
- Electron opens a transparent, click-through, always-on-top translation overlay.

This is intentionally not continuous real-time translation yet. It does not capture protected content, bypass DRM/screenshot controls, run in the background, send content to a cloud service, or collect telemetry.

## Run

Requires Node 20+.

```bash
npm install
npm run build
npm test
npm run dev
```

`npm run dev` starts Vite and Electron locally. In a packaged build, use Electron to launch the app after `npm run build`.

## Supported platforms and permissions

Windows and Linux are equal first-class targets for this MVP. Both use the same explicit source-picker → one-frame OCR → local translation → transparent overlay flow.

- **Windows 10/11:** a user selects a screen/window in-app. Windows may show its own capture consent UI; protected content remains unavailable and is never worked around. Package output is an NSIS installer for x64 and ARM64.
- **Linux:** support is for an active graphical X11 or Wayland desktop session. Under Wayland, desktop capture is mediated by the compositor/xdg-desktop-portal; the system picker and permissions are authoritative, and window enumeration/transparent click-through overlays can vary by compositor. Test GNOME and KDE before release. Package output is AppImage and Debian `.deb` for x64 and ARM64.
- **macOS:** developer environment only, not a release target. Apple Silicon developers can use native Node and Electron to run build/test commands; do not claim production support.

See [docs/packaging.md](docs/packaging.md) for release commands and the cross-platform test plan.

## Architecture and contribution

See [docs/architecture.md](docs/architecture.md) and [CONTRIBUTING.md](CONTRIBUTING.md). Source OCR and translation are deliberately isolated so a future, explicitly opted-in local model can replace the demonstration glossary.
