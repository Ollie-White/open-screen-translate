# OpenScreen Translate

An original, Apache-2.0-licensed, offline-first screen translation MVP for Windows. It is a clean-room project: it shares only general user-facing capabilities with other screen translators and contains no copied code, branding, UI, text, binaries, or reverse engineering.

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

## Platform notes

Windows is the MVP target. On macOS Apple Silicon, install Node ARM64 and Electron normally, then run the same commands. macOS will require the user to grant Screen Recording permission to the app/terminal in System Settings. The legacy Electron media constraint used for the explicit source picker may need replacement with a native `setDisplayMediaRequestHandler`/system picker before distribution; test it on each Electron/macOS release. Android is deliberately out of scope.

## Architecture and contribution

See [docs/architecture.md](docs/architecture.md) and [CONTRIBUTING.md](CONTRIBUTING.md). Source OCR and translation are deliberately isolated so a future, explicitly opted-in local model can replace the demonstration glossary.
