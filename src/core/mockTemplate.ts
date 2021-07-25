/**
 * Template for a mock extension method.
 */
export interface MockTemplate<T, R = T>
{
	(template?: Partial<T>): R;
}
