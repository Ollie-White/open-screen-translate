import { createWorker } from 'tesseract.js';

export async function recognizeCanvas(canvas: HTMLCanvasElement): Promise<string> {
  const worker = await createWorker('eng');
  try { return (await worker.recognize(canvas)).data.text.trim(); }
  finally { await worker.terminate(); }
}
