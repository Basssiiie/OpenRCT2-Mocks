/**
 * Makes a type's properties writable by removing all readonly modifiers.
 */
export type Writeable<T> = { -readonly [P in keyof T]: T[P] };