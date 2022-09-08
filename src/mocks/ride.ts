import { Mocker } from "../core/mocker";
import { tryAddGet } from "../utilities/object";
import { RideObjectMocker } from "./objects/rideObject";


let rideId = 0;


/**
 * Mock that adds additional configurations to the ride.
 */
interface RideMock extends Ride
{
	objectId: number;
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
	// Get 'object' from global context if not set.
	tryAddGet(mock, "object", () =>
	{
		if (!global.context)
		{
			return RideObjectMocker();
		}
		const objId = (typeof mock.objectId !== "number") ? mock.objectId : -1;
		return global.context.getObject("ride", objId);
	});
	return mock;
}