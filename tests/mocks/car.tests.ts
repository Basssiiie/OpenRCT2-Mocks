/// <reference path="../../lib/openrct2.d.ts" />

import test from "ava";
import Mock from "../../src";
import { CarMocker } from "../../src/mocks/entities/car";


test("All auto-mocked members are overridable", t =>
{
	const hits: string[] = [];
	const mock = CarMocker({
		x: 44, y: 10, z: 95,
		status: "crashed",
		peeps: [ 1, 2 ],
		guests: [ 2, 3 ],
		trackLocation: { x: 5, y: 7, z: 9, direction: 2 },
		trackProgress: 101,
		remainingDistance: 4,
		subposition: 7,
		poweredAcceleration: 21,
		poweredMaxSpeed: 45,
		acceleration: 12,
		velocity: 4,
		numSeats: 8,
		mass: 123,
		vehicleObject: 1,
		currentStation: 5,
		nextCarOnTrain: 53,
		nextCarOnRide: 3,
		previousCarOnRide: 32,
		gForces: { lateralG: 25, verticalG: -5 },
		colours: { body: 12, trim: 9, tertiary: 27 },
		travelBy(distance: number) { hits.push(`travel by ${distance}`); },
	});

	t.is(mock.type, "car");
	t.is(mock.x, 44);
	t.is(mock.y, 10);
	t.is(mock.z, 95);
	t.is(mock.status, "crashed");
	t.deepEqual(mock.peeps, [ 1, 2 ]);
	t.deepEqual(mock.guests, [ 2, 3 ]);
	t.deepEqual(mock.trackLocation, { x: 5, y: 7, z: 9, direction: 2 });
	t.is(mock.trackProgress, 101);
	t.is(mock.remainingDistance, 4);
	t.is(mock.subposition, 7);
	t.is(mock.poweredAcceleration, 21);
	t.is(mock.poweredMaxSpeed, 45);
	t.is(mock.acceleration, 12);
	t.is(mock.velocity, 4);
	t.is(mock.numSeats, 8);
	t.is(mock.mass, 123);
	t.is(mock.vehicleObject, 1);
	t.is(mock.currentStation, 5);
	t.is(mock.nextCarOnTrain, 53);
	t.is(mock.nextCarOnRide, 3);
	t.is(mock.previousCarOnRide, 32);
	t.deepEqual(mock.gForces, { lateralG: 25, verticalG: -5 });
	t.deepEqual(mock.colours, { body: 12, trim: 9, tertiary: 27 });
	mock.travelBy(12345);
	t.deepEqual(hits, [ "travel by 12345" ]);
});


test("Vehicle properties can be taken from ride object mock if present", t =>
{
	globalThis.context = Mock.context({ objects: [
		Mock.rideObject({ index: 45, vehicles: [
			Mock.rideObjectVehicle({ numSeats: 5, carMass: 100, poweredAcceleration: 1, poweredMaxSpeed: 2 }),
			Mock.rideObjectVehicle({ numSeats: 12, carMass: 310, poweredAcceleration: 40, poweredMaxSpeed: 50 })
		]})
	]});

	const mock = CarMocker({
		rideObject: 45,
		vehicleObject: 1
	});

	t.is(mock.numSeats, 12);
	t.is(mock.mass, 310);
	t.is(mock.poweredAcceleration, 40);
	t.is(mock.poweredMaxSpeed, 50);
});


test("Vehicle object properties can still be manually mocked", t =>
{
	globalThis.context = Mock.context({ objects: [
		Mock.rideObject({ index: 45, vehicles: [
			Mock.rideObjectVehicle({ numSeats: 5, carMass: 100, poweredAcceleration: 1, poweredMaxSpeed: 2 }),
			Mock.rideObjectVehicle({ numSeats: 12, carMass: 310, poweredAcceleration: 40, poweredMaxSpeed: 50 })
		]})
	]});

	const mock = CarMocker({
		rideObject: 45,
		vehicleObject: 1,
		poweredAcceleration: 21,
		poweredMaxSpeed: 45,
		numSeats: 8,
		mass: 123,
	});

	t.is(mock.numSeats, 8);
	t.is(mock.mass, 123);
	t.is(mock.poweredAcceleration, 21);
	t.is(mock.poweredMaxSpeed, 45);
});
