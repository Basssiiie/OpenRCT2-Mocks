import { Mocker } from "../../core/mocker";
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
	if (!("isLost" in mock)) // Calculate from 'monthsElapsed' if not present.
	{
		Object.defineProperty(mock, "isLost", {
			configurable: true, enumerable: true,
			get: () => (mock.lostCountdown < 90)
		});
	}
	return mock;
}