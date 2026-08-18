import { useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { recognizeCanvas } from './ocr';
import { LocalGlossaryTranslator } from './translator';
import './styles.css';

type Source = { id: string; name: string; thumbnail: string };
const translator = new LocalGlossaryTranslator();

function App() {
  const [sources, setSources] = useState<Source[]>([]); const [source, setSource] = useState<Source>();
  const [language, setLanguage] = useState('es'); const [result, setResult] = useState(''); const [status, setStatus] = useState('Choose a screen or window to begin.');
  const stream = useRef<MediaStream | undefined>(undefined);
  async function choose(): Promise<void> { setSources(await window.openScreen.sources()); setStatus('Select a source; capture begins only after you click it.'); }
  async function start(selected: Source): Promise<void> {
    setSource(selected); setStatus('Requesting capture permission…');
    stream.current = await navigator.mediaDevices.getUserMedia({ audio: false, video: { mandatory: { chromeMediaSource: 'desktop', chromeMediaSourceId: selected.id } } as MediaTrackConstraints });
    setStatus('Ready. Use “Read current frame” to OCR locally.');
  }
  async function read(): Promise<void> {
    if (!stream.current) return; setStatus('Recognising text locally…');
    const video = document.createElement('video'); video.srcObject = stream.current; await video.play();
    const canvas = document.createElement('canvas'); canvas.width = video.videoWidth; canvas.height = video.videoHeight; canvas.getContext('2d')?.drawImage(video, 0, 0);
    const text = await recognizeCanvas(canvas); const translated = await translator.translate(text || '(No text found)', language);
    setResult(translated); await window.openScreen.showOverlay(translated); setStatus('Overlay shown. Nothing left this device.');
  }
  return <main><h1>OpenScreen Translate</h1><p className="privacy">Local capture • local OCR • local glossary demo</p><button onClick={choose}>Choose screen/window</button>
    {sources.length > 0 && <section className="sources">{sources.map(s => <button className="source" key={s.id} onClick={() => start(s)}><img src={s.thumbnail}/><span>{s.name}</span></button>)}</section>}
    {source && <><label>Target <select value={language} onChange={e => setLanguage(e.target.value)}><option value="es">Spanish</option><option value="fr">French</option><option value="demo">Demo passthrough</option></select></label><button onClick={read}>Read current frame</button><button className="secondary" onClick={() => window.openScreen.hideOverlay()}>Hide overlay</button></>}
    <p className="status">{status}</p>{result && <pre>{result}</pre>}<p className="small">MVP: a user chooses a source, then explicitly triggers a one-frame OCR. No continuous capture, cloud OCR, account, telemetry, DRM, or screenshot-protection bypass.</p></main>;
}
createRoot(document.getElementById('root')!).render(<App />);
