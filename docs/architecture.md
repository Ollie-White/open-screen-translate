# Architecture

```
User click → Electron desktopCapturer source list → renderer getUserMedia
          → one-frame canvas → Tesseract.js (local) → Translator adapter
          → IPC → transparent click-through BrowserWindow overlay

Windows and Linux use this shared application core. Platform integration is a thin boundary: Windows delegates any OS consent to Windows; Linux delegates portal/compositor-mediated capture consent to the current desktop session. No code path tries to evade an OS, compositor, DRM, or protected-content restriction.
```

The main process exposes only three narrow IPC operations through a context-isolated preload bridge: list sources, show overlay, hide overlay. The renderer has no Node integration. OCR uses Tesseract.js locally; the shipped `LocalGlossaryTranslator` is deterministic and network-free. A future offline translation engine should implement `Translator`; an optional remote adapter must disclose its endpoint and require a per-session user opt-in.

Security boundaries: screen acquisition occurs only after a user action; frames are not persisted; no telemetry, account, network client, or auto-start exists. The overlay accepts text only from the main-window IPC path. Protected/screenshot-blocked surfaces remain unavailable by design and must not be circumvented.

## Platform boundary

- **Windows:** validate screen/window enumeration, capture consent where applicable, high-DPI and multi-monitor coordinate handling, and the click-through overlay on Windows 10/11.
- **Linux:** validate on both X11 and Wayland sessions. Wayland capture must use the compositor/portal-approved path; test GNOME and KDE. Overlay behaviour (especially click-through and stacking) is compositor-dependent, so unsupported combinations must surface a clear limitation rather than use a workaround.
- **macOS:** development-only. It is excluded from release artifacts and MVP acceptance criteria.
