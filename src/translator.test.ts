import { describe, expect, it } from 'vitest';
import { LocalGlossaryTranslator } from './translator';
describe('LocalGlossaryTranslator', () => {
  it('replaces known Spanish glossary terms without a network provider', async () => expect(await new LocalGlossaryTranslator().translate('Hello, start settings!', 'es')).toBe('hola, iniciar ajustes!'));
  it('makes unsupported targets explicit rather than silently sending text away', async () => expect(await new LocalGlossaryTranslator().translate('Hello', 'de')).toBe('[local/de] Hello'));
});
