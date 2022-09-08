import { Mocker } from "../../core/mocker";
import { tryAddGet } from "../../utilities/object";
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
	const mock = Mocker<GuestMock>({
		peepType: "guest",
		isInPark: true,

		...(PeepMocker(template) as Partial<Entity>),
		type: "guest",
	});
	tryAddGet(mock, "isLost", () => (mock.lostCountdown < 90));

	return mock;
}