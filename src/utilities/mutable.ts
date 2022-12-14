/**
 * Makes a type's properties writable by removing all readonly modifiers.
 */
export type Mutable<T> = { -readonly [P in keyof T]: T[P] };