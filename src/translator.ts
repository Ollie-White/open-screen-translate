/** Provider seam: replace LocalGlossaryTranslator with an explicit opt-in offline model or remote provider later. */
export interface Translator { translate(text: string, targetLanguage: string): Promise<string>; }

const glossary: Record<string, Record<string, string>> = {
  es: { hello: 'hola', welcome: 'bienvenido', start: 'iniciar', settings: 'ajustes', exit: 'salir', loading: 'cargando', yes: 'sí', no: 'no' },
  fr: { hello: 'bonjour', welcome: 'bienvenue', start: 'démarrer', settings: 'paramètres', exit: 'quitter', loading: 'chargement', yes: 'oui', no: 'non' }
};

export class LocalGlossaryTranslator implements Translator {
  async translate(text: string, targetLanguage: string): Promise<string> {
    const words = glossary[targetLanguage];
    if (!words) return `[local/${targetLanguage}] ${text}`;
    return text.replace(/\b[\w']+\b/gi, token => words[token.toLowerCase()] ?? token);
  }
}
