const EMOJI_PREFIX = new RegExp('^[\\p{Extended_Pictographic}\\p{Emoji_Modifier}\\u{FE0F}\\u{200D}\\u{20E3}\\s]+', 'u');

/** Labels carry an emoji for the README; the builder chrome draws its own icons. */
export const cleanLabel = (label: string) => label.replace(EMOJI_PREFIX, '').trim();

/** Help strings are written as code comments ("// …"); the builder shows them as prose. */
export const cleanHelp = (help: string) => help.replace(/^\/\/\s*/, '').trim();
