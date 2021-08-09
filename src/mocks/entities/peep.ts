import { Mocker } from "../../core/mocker";
import { EntityMocker } from "./entity";


/**
 * Mock that adds additional configurations to the peep.
 */
export interface PeepMock extends Peep
{
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

		...(EntityMocker(template) as Partial<Entity>)
	});
	return peep;
}