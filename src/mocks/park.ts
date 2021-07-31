import { Mocker } from "../core/mocker";


/**
 * Mock that adds additional configurations to the park.
 */
export interface ParkMock extends Park
{
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
			return (this.flags !== undefined && hasFlag(this.flags, flag));
		},
		setFlag(flag: ParkFlags, value: boolean): void
		{
			if (value)
			{
				if (!this.flags)
				{
					this.flags = [ flag ];
				}
				else if (!hasFlag(this.flags, flag))
				{
					this.flags.push(flag);
				}
			}
			else if (this.flags)
			{
				const idx = this.flags.indexOf(flag);
				if (idx !== -1)
				{
					this.flags.splice(idx, 1);
				}
			}
		},

		...template,
	});
	if (!("guests" in mock))
	{
		// If 'guests' is not set, attempt to calculate from map global.
		Object.defineProperty(mock, "guests", {
			configurable: true,
			enumerable: true,
			get: () => (global.map)
				? global.map.getAllEntities("peep").filter(p => p.peepType == "guest").length
				: 0
		});
	}
	return mock;
}


function hasFlag(flags: ParkFlags[], flag: ParkFlags): boolean
{
	return (flags.indexOf(flag) !== -1);
}