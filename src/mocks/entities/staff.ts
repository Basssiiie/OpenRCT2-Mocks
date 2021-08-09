import { Mocker } from "../../core/mocker";
import { PeepMock, PeepMocker } from "./peep";


/**
 * Mock that adds additional configurations to the staff.
 */
export interface StaffMock extends Staff, PeepMock
{
}


/**
 * A mock of a staff entity.
 * @internal
 */
export function StaffMocker(template?: Partial<StaffMock>): StaffMock
{
	const Staff = Mocker<StaffMock>({
		peepType: "staff",

		...(PeepMocker(template) as Partial<Entity>)
	});
	return Staff;
}