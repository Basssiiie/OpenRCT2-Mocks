import { Mocker } from "../../core/mocker";


let imageId = 0;


/**
 * A mock of a ride object vehicle.
 * @internal
 */
export function RideObjectVehicleMock(template?: Partial<RideObjectVehicle>): RideObjectVehicle
{
	return Mocker<RideObjectVehicle>({
		baseImageId: (++imageId),
		// These fallback to 0 if they do are not powered.
		poweredAcceleration: 0,
		poweredMaxSpeed: 0,

		...template,
	});
}