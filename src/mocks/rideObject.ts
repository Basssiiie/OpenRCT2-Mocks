import { LoadedObjectMocker } from "./loadedObject";
import { Mocker } from "../core/mocker";
import { RideObjectVehicleMock } from "./rideObjectVehicle";


/**
 * A mock of a ride object.
 * @internal
 */
export function RideObjectMocker(template?: Partial<RideObject>): RideObject
{
	return Mocker<RideObject>({
		type: "ride",
		carsPerFlatRide: 255,
		vehicles: [
			RideObjectVehicleMock()
		],

		...(LoadedObjectMocker(template) as Partial<LoadedObject>),
	});
}