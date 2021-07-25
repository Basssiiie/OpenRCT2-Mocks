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
	return Mocker<RideMock>({
		id: (++rideId),
		classification: "ride",
		vehicles: [],
		get object()
		{
			return context.getObject("ride", this.objectId ?? -1);
		},

		...template,
	});
}