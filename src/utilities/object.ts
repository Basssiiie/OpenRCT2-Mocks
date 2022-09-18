
/**
 * Tries to add a getter for the specified key, if one does not exist yet.
 */
export function tryAddGet<T, K extends keyof T>(obj: T, key: K, get: (this: T) => T[K]): void
{
	if (!(key in obj))
	{
		Object.defineProperty(obj, key, {
			configurable: true, enumerable: true, get,
			set: v => { delete obj[key]; obj[key] = v; }
		});
	}
}


/**
 * Returns true if the specfied key is a getter on the object, or false if not.
 */
export function isGetter<T, K extends keyof T>(obj: T, key: K): boolean
{
	const descriptor = Object.getOwnPropertyDescriptor(obj, key);
	return (!!descriptor && !!descriptor.get);
}