/**
 * Tiny base-language resolver for the handful of strings that are still written inline in code
 * rather than living in `locales/*.json` (chat-reaction quips, admin-only panels, a few lobby
 * extras). It mirrors `Translator`'s requested -> base -> default semantics: an unknown language
 * falls back to `en`, the default locale, so a Spanish caller never sees French or an undefined
 * branch.
 *
 * Prefer adding a key to `locales/*.json` and going through `Translator` for anything new; this is
 * only for the residual hardcoded wording that predates the locale files.
 */
export type BaseLang = 'fr' | 'en' | 'es';

/** Normalizes any Telegram/group locale tag (`fr-FR`, `es-419`, `en-GB`, ...) to a supported base
 * language, defaulting to `en`. */
export function baseLanguage(code: string | null | undefined): BaseLang {
  const c = (code ?? '').toLowerCase();
  if (c.startsWith('fr')) return 'fr';
  if (c.startsWith('es')) return 'es';
  return 'en';
}

/** Picks the French, English or Spanish variant for `code` - French/English preserved exactly, so
 * adding Spanish never changes what existing `fr`/`en` users see. */
export function pickLang(
  code: string | null | undefined,
  fr: string,
  en: string,
  es: string,
): string {
  const lang = baseLanguage(code);
  if (lang === 'fr') return fr;
  if (lang === 'es') return es;
  return en;
}
