/** Shared geometry contract for the 24×24 stroke icon registry. */
export type IconShape = readonly ['path', string] | readonly ['circle', number, number, number] | readonly ['rect', number, number, number, number, number?]
