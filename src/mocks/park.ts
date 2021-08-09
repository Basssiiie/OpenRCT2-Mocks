import { Mocker } from "../core/mocker";
import * as Flags from "../utilities/flags";


/**
 * Mock that adds additional configurations to the park.
 */
export interface ParkMock extends Park
{
	/**
	 * Stores all flags that are enabled for this park.
	 */
	flags: ParkFlags[];
}


/**
 * A mock of an OpenRCT2 loaded object.
 * @internal
 */
export function ParkMocker(template?: Partial<ParkMock>): ParkMock
{
	const mock = Mocker<ParkMock>({
		getFlag(flag: ParkFlags): boolean
		{
			return Flags.has(this.flags, flag);
		},
		setFlag(flag: ParkFlags, value: boolean): void
		{
			this.flags = Flags.set(this.flags, flag, value);
		},

		...template,
	});
	if (!("guests" in mock)) // If 'guests' is not set, attempt to calculate from map global.
	{
		Object.defineProperty(mock, "guests", {
			configurable: true, enumerable: true,
			get: () => (global.map)
				? global.map.getAllEntities("guest").length
				: 0
		});
	}
	return mock;
}