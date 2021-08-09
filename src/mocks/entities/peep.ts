import { Mocker } from "../../core/mocker";
import { EntityMocker } from "./entity";
import * as Flags from "../../utilities/flags";


/**
 * Mock that adds additional configurations to the peep.
 */
export interface PeepMock extends Peep
{
	/**
	 * Stores all flags that are enabled for this peep.
	 */
	flags: PeepFlags[];
}


/**
 * A mock of a peep entity.
 * @internal
 */
export function PeepMocker(template?: Partial<PeepMock>): PeepMock
{
	const peep = Mocker<PeepMock>({
		type: "peep",
		flags: [],
		getFlag(flag: PeepFlags): boolean
		{
			return Flags.has(this.flags, flag);
		},
		setFlag(flag: PeepFlags, value: boolean): void
		{
			this.flags = Flags.set(this.flags, flag, value);
		},

		...(EntityMocker(template) as Partial<Entity>)
	});
	return peep;
}