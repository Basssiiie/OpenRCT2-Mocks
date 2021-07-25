/**
 * Gets the first matching item, `undefined` if the array is falsy or no items match the predicate.
 * @param array The array to check.
 * @param predicate The function to match the items against.
 */
export function tryFind<T>(array: T[] | undefined, predicate: (item: T) => boolean): T | undefined
{
	if (array)
	{
		for (let i = 0; i < array.length; i++)
		{
			const item = array[i];
			if (predicate(item))
			{
				return item;
			}
		}
	}
	return undefined;
}