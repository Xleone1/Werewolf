import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { getDefaultLocale, loadLocales } from '../../src/infrastructure/i18n/locale-loader.js';
import { Translator } from '../../src/infrastructure/i18n/translator.js';

describe('loadLocales (real locales/ directory)', () => {
  it('loads en.json as the default locale and fr.json alongside it', async () => {
    const locales = await loadLocales();
    expect(locales.has('en')).toBe(true);
    expect(locales.has('fr')).toBe(true);

    const defaultLocale = getDefaultLocale(locales);
    expect(defaultLocale.code).toBe('en');
  });

  it('can translate a key in every shipped locale without throwing', async () => {
    const locales = await loadLocales();
    const defaultLocale = getDefaultLocale(locales);
    const t = new Translator(locales, defaultLocale);

    for (const code of locales.keys()) {
      expect(() => t.translate(code, 'PlayerStartedGame', 'Alice')).not.toThrow();
    }
  });

  it('ships a Spanish locale with full key and placeholder parity against English', async () => {
    const locales = await loadLocales();
    expect(locales.has('es')).toBe(true);

    const en = locales.get('en')!;
    const es = locales.get('es')!;
    expect(es.base).toBe('en');

    const enKeys = Object.keys(en.strings).sort();
    const esKeys = Object.keys(es.strings).sort();
    expect(esKeys).toEqual(enKeys);

    const placeholders = (variants: string[]) =>
      (variants.join(' ').match(/\{\d+\}/g) ?? []).sort().join(',');
    for (const key of enKeys) {
      expect(placeholders(es.strings[key]!)).toBe(placeholders(en.strings[key]!));
    }
  });

  it('narrates a gameplay key in Spanish instead of falling back to English', async () => {
    const locales = await loadLocales();
    const t = new Translator(locales, getDefaultLocale(locales));

    const spanish = t.translate('es', 'PlayerStartedGame', 'Alice');
    const english = t.translate('en', 'PlayerStartedGame', 'Alice');
    expect(spanish).toContain('Alice');
    expect(spanish).not.toBe(english);

    // A French locale still resolves to its own wording, untouched.
    expect(t.translate('fr', 'PlayerStartedGame', 'Alice')).not.toBe(english);

    // Translator keys off the exact locale code; a regional tag that isn't loaded falls back to
    // the default locale (callers normalize via `baseLanguage()` before passing one in).
    const englishVariants = locales
      .get('en')!
      .strings.PlayerStartedGame!.map((v) => v.replace('{0}', 'Alice'));
    expect(englishVariants).toContain(t.translate('es-MX', 'PlayerStartedGame', 'Alice'));
  });
});

describe('loadLocales (language packs, temp directory)', () => {
  let dir: string | undefined;

  afterEach(async () => {
    if (dir) await rm(dir, { recursive: true, force: true });
    dir = undefined;
  });

  it('loads a pack alongside its base language, keyed by its own code', async () => {
    dir = await mkdtemp(path.join(tmpdir(), 'werewolf-locales-'));
    await writeFile(
      path.join(dir, 'en.json'),
      JSON.stringify({ code: 'en', name: 'English', isDefault: true, strings: {} }),
    );
    await writeFile(
      path.join(dir, 'en-spooky.json'),
      JSON.stringify({
        code: 'en-spooky',
        name: 'English (Spooky)',
        base: 'en',
        isPack: true,
        strings: {},
      }),
    );

    const locales = await loadLocales(dir);
    expect(locales.has('en')).toBe(true);
    expect(locales.has('en-spooky')).toBe(true);
    expect(locales.get('en-spooky')!.base).toBe('en');
  });

  it("rejects a pack whose base isn't among the loaded locales", async () => {
    dir = await mkdtemp(path.join(tmpdir(), 'werewolf-locales-'));
    await writeFile(
      path.join(dir, 'en.json'),
      JSON.stringify({ code: 'en', name: 'English', isDefault: true, strings: {} }),
    );
    await writeFile(
      path.join(dir, 'orphan.json'),
      JSON.stringify({ code: 'orphan', name: 'Orphan Pack', base: 'nonexistent', strings: {} }),
    );

    await expect(loadLocales(dir)).rejects.toThrow(/declares base "nonexistent"/);
  });
});
