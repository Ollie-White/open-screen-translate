interface Window { openScreen: { sources(): Promise<Array<{ id: string; name: string; thumbnail: string }>>; showOverlay(text: string): Promise<void>; hideOverlay(): Promise<void>; onOverlayText(callback: (text: string) => void): void; }; }
declare module '*.css';
