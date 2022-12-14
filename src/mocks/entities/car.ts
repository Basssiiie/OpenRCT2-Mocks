import { Mocker } from "../../core/mocker";
import { Mutable } from "../../utilities/mutable";
import { CoordsMock } from "../coords";
import { EntityMocker } from "./entity";


/**
 * Mock that adds additional configurations to the car.
 */
export type CarMock = Mutable<Car>;


/**
 * A mock of a car entity.
 * @internal
 */
export function CarMocker(template?: Partial<CarMock>): CarMock
{
	const guests: number[] = [];
	const car = Mocker<CarMock>({
		type: "car",
		status: "waiting_for_passengers", // id 0
		peeps: guests,
		guests,
		trackLocation: CoordsMock(),
		trackProgress: 0,
		remainingDistance: 0,
		subposition: 0,
		acceleration: 0,
		velocity: 0,
		vehicleObject: 0,
		currentStation: 0,
		nextCarOnTrain: null,
		nextCarOnRide: null,
		previousCarOnRide: null,
		gForces: { lateralG: 0, verticalG: 0 },
		colours: { body: 0, trim: 0, tertiary: 0 },

		travelBy(distance: number): void
		{
			this.remainingDistance = ((this.remainingDistance) ? this.remainingDistance : 0) + distance;
			this.trackProgress = ((this.trackProgress) ? this.trackProgress : 0) + (distance / 8716);
		},

		...(EntityMocker(template) as Partial<Entity>)
	});
	// Init car based on object if any is specified
	if ("rideObject" in car && "vehicleObject" in car)
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
	const obj = getVehicleObject(car);

	if (!("numSeats" in car))
	{
		(<Car>car).numSeats = (obj && obj.numSeats) ? obj.numSeats : 0;
	}
	if (!("mass" in car))
	{
		(<Car>car).mass = (obj && obj.carMass) ? obj.carMass : 0;
	}
	if (!("poweredAcceleration" in car))
	{
		(<Car>car).poweredAcceleration = (obj && obj.poweredAcceleration) ? obj.poweredAcceleration : 0;
	}
	if (!("poweredMaxSpeed" in car))
	{
		(<Car>car).poweredMaxSpeed = (obj && obj.poweredMaxSpeed) ? obj.poweredMaxSpeed : 0;
	}
}


function getVehicleObject(car: CarMock): RideObjectVehicle | null
{
	if (global.context)
	{
		const rideObject = global.context.getObject("ride", car.rideObject);
		if (rideObject)
		{
			const obj = rideObject.vehicles[car.vehicleObject];
			if (obj)
			{
				return obj;
			}
		}
	}
	return null;
}