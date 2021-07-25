/**
 * Allows creating a (partial) mock of the specified type or interface.
 *
 * @param source A partial of T containing the mocked methods and values.
 * @returns The specified partial as a fully typed T.
 */
export function Mocker<T>(source?: Partial<T>): T
{
	return source as T;
}
