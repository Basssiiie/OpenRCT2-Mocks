import { Mocker } from "../core/mocker";


/**
 * Mock that adds additional configurations to the park.
 */
export interface ParkMock extends Park
{
	flags: ParkFlags[];
}


export function ParkMocker(template?: Partial<ParkMock>): ParkMock
{
	return Mocker<ParkMock>({
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
}


function hasFlag(flags: ParkFlags[], flag: ParkFlags): boolean
{
	return (flags.indexOf(flag) !== -1);
}