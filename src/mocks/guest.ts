import { Mocker } from "../core/mocker";
import { PeepMock, PeepMocker } from "./peep";


/**
 * Mock that adds additional configurations to the guest.
 */
export interface GuestMock extends Guest, PeepMock
{
}


/**
 * A mock of a guest entity.
 * @internal
 */
export function GuestMocker(template?: Partial<GuestMock>): GuestMock
{
	const Guest = Mocker<GuestMock>({
		peepType: "guest",

		...(PeepMocker(template) as Partial<Entity>)
	});
	return Guest;
}