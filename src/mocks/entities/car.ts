import { Mocker } from "../../core/mocker";
import { EntityMocker } from "./entity";


/**
 * Mock that adds additional configurations to the car.
 */
export interface CarMock extends Car
{
	remainingDistance: number;
	trackProgress: number;
}


/**
 * A mock of a car entity.
 * @internal
 */
export function CarMocker(template?: Partial<CarMock>): CarMock
{
	const car = Mocker<CarMock>({
		type: "car",
		peeps: [],
		poweredAcceleration: 0,
		poweredMaxSpeed: 0,
		vehicleObject: 0,
		travelBy(distance: number): void
		{
			this.remainingDistance = ((this.remainingDistance) ? this.remainingDistance : 0) + distance;
			this.trackProgress = ((this.trackProgress) ? this.trackProgress : 0) + (distance / 9000);
		},

		...(EntityMocker(template) as Partial<Entity>)
	});
	// Init car based on object if any is specified
	if (global.context && "rideObject" in car && "vehicleObject" in car)
	{
		tryUpdateCarFromObject(car);
	}
	return car;
}


/**
 * Sets the properties of the car according to a specified ride object, if present.
 */
function tryUpdateCarFromObject(car: CarMock): void
{
	const rideObject = global.context.getObject("ride", car.rideObject);
	if (!rideObject)
		return;

	const obj = rideObject.vehicles[car.vehicleObject];
	if (!obj)
		return;

	car.numSeats = (obj.numSeats) ? obj.numSeats : 0;
	car.mass = (obj.carMass) ? obj.carMass : 0;
	car.poweredAcceleration = (obj.poweredAcceleration) ? obj.poweredAcceleration : 0;
	car.poweredMaxSpeed = (obj.poweredMaxSpeed) ? obj.poweredMaxSpeed : 0;
}
