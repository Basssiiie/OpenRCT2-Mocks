
/**
 * Tries to add a getter for the specified key, if one does not exist yet.
 */
export function tryAddGet<T, K extends keyof T>(mock: T, key: K, get: (this: T) => T[K]): void
{
	if (!(key in mock))
	{
		Object.defineProperty(mock, key, { configurable: true, enumerable: true, get });
	}
}