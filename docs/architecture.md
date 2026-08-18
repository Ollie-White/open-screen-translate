# Architecture

```
User click → Electron desktopCapturer source list → renderer getUserMedia
          → one-frame canvas → Tesseract.js (local) → Translator adapter
          → IPC → transparent click-through BrowserWindow overlay
```

The main process exposes only three narrow IPC operations through a context-isolated preload bridge: list sources, show overlay, hide overlay. The renderer has no Node integration. OCR uses Tesseract.js locally; the shipped `LocalGlossaryTranslator` is deterministic and network-free. A future offline translation engine should implement `Translator`; an optional remote adapter must disclose its endpoint and require a per-session user opt-in.

Security boundaries: screen acquisition occurs only after a user action; frames are not persisted; no telemetry, account, network client, or auto-start exists. The overlay accepts text only from the main-window IPC path. Protected/screenshot-blocked surfaces remain unavailable by design and must not be circumvented.
