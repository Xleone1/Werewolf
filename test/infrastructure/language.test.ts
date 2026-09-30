import { describe, expect, it } from 'vitest';
import { baseLanguage, pickLang } from '../../src/infrastructure/i18n/language.js';

describe('baseLanguage', () => {
  it('maps regional tags to their supported base language', () => {
    expect(baseLanguage('fr')).toBe('fr');
    expect(baseLanguage('fr-FR')).toBe('fr');
    expect(baseLanguage('es')).toBe('es');
    expect(baseLanguage('es-419')).toBe('es');
    expect(baseLanguage('ES-mx')).toBe('es');
    expect(baseLanguage('en-GB')).toBe('en');
  });

  it('defaults anything unsupported or missing to en, the default locale', () => {
    expect(baseLanguage('de')).toBe('en');
    expect(baseLanguage(null)).toBe('en');
    expect(baseLanguage(undefined)).toBe('en');
  });
});

describe('pickLang', () => {
  it('returns the matching variant for fr, en and es', () => {
    expect(pickLang('fr-FR', 'fr', 'en', 'es')).toBe('fr');
    expect(pickLang('en', 'fr', 'en', 'es')).toBe('en');
    expect(pickLang('es-AR', 'fr', 'en', 'es')).toBe('es');
  });

  it('falls back to the English variant for an unsupported language', () => {
    expect(pickLang('it', 'fr', 'en', 'es')).toBe('en');
  });
});
