# Packaging and platform test plan

OpenScreen Translate ships only for Windows and Linux. Local package commands do not publish anything. GitHub Actions checks each push and, when a `v*` tag is pushed, creates a GitHub Release containing installable x64 artifacts.

## Package commands

```bash
npm run package:win
npm run package:linux
```

Both commands build the renderer and Electron main process first, then write artifacts to `release/` (which is ignored by Git).

- Windows: NSIS installer for x64 and ARM64.
- Linux: AppImage and Debian `.deb` for x64 and ARM64.

Release owners must code-sign Windows artifacts before public distribution. Linux artifacts must state supported desktop environments and retain dependency/licence notices. macOS is developer-only and must not receive an artifact from this project.

## GitHub releases

Push a semver version tag to create a release:

```bash
git tag v0.1.0
git push origin v0.1.0
```

The release workflow builds and attaches:

- Windows x64: NSIS `.exe` installer
- Linux x64: portable `.AppImage`

The package job also uploads the same artifacts to every manually dispatched run, but only a version tag creates a public GitHub Release. Windows artifacts are not code-signed yet, so users will see the normal unsigned-app warning. Do not tag a production release until the interactive manual acceptance checks below have passed.

## Manual acceptance matrix

| Target | Required session | Verify |
| --- | --- | --- |
| Windows 10/11 x64/ARM64 | Interactive desktop | App launches; a user can choose a screen/window, OCR one allowed frame, view/hide a click-through overlay, and deny/cancel capture without a crash. |
| Linux x64/ARM64, X11 | Interactive X11 desktop | Same flow, plus multi-monitor source selection and overlay stacking/click-through. |
| Linux x64/ARM64, Wayland GNOME | Portal-enabled interactive session | System/portal picker and consent are honoured; allowed frame OCR works; unsupported overlay behaviour is explained without a bypass. |
| Linux x64/ARM64, Wayland KDE | Portal-enabled interactive session | Same as GNOME. |

Automated CI runs build, unit tests, and type checks on `windows-latest` and `ubuntu-latest`. GUI capture and overlay behaviour require the above interactive manual checks because hosted CI has no trusted desktop-capture session.

## Permissions and limits

Capture begins only after an in-app user action. The application must not request broad background capture, auto-start, accessibility escalation, or root privileges. On Linux/Wayland, the compositor and xdg-desktop-portal own the consent and source-selection decision. DRM/protected/screenshot-blocked surfaces are unavailable by design.
