import { Mocker } from "../core/mocker";


let rideId = 0;


/**
 * Mock that adds additional configurations to the ride.
 */
interface RideMock extends Ride
{
	objectId: number
}


/**
 * A mock of a ride.
 * @internal
 */
export function RideMocker(template?: Partial<RideMock>): RideMock
{
	const mock = Mocker<RideMock>({
		id: (++rideId),
		classification: "ride",
		vehicles: [],

		...template,
	});
	if (!("object" in mock)) // Get 'object' from global context if not set.
	{
		Object.defineProperty(mock, "object", {
			configurable: true, enumerable: true,
			get: () => (global.context)
				? global.context.getObject("ride", (typeof mock.objectId !== "number") ? mock.objectId : -1)
				: 0
		});
	}
	return mock;
}