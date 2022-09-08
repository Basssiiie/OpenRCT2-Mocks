import { Mocker } from "../core/mocker";
import * as Flags from "../utilities/flags";
import { tryAddGet } from "../utilities/object";


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
	// If 'guests' is not set, attempt to calculate from map global.
	tryAddGet(mock, "guests", () => (global.map)
		? global.map.getAllEntities("guest").filter(g => g.isInPark).length
		: 0
	);
	return mock;
}