/// <reference path="../../lib/openrct2.d.ts" />

import test from "ava";
import Mock from "../../src/index";
import { GameMapMocker } from "../../src/mocks/gameMap";


test("All auto-mocked members are overridable", t =>
{
	const hits: unknown[] = [];
	const mock = GameMapMocker({
		numEntities: 234,
		numRides: 567,
		rides: [ Mock.ride({ id: 987 }) ],
		getAllEntities(type: EntityType) { hits.push(type); return []; },
		getEntity(id: number) { hits.push(id); return {} as Entity; },
		getRide(id: number) { hits.push(id); return {} as Ride; },
		getTile(x: number, y: number) { hits.push(`${x},${y}`); return {} as Tile; }
	});

	t.is(mock.numEntities, 234);
	t.is(mock.numRides, 567);
	t.is(mock.rides[0].id, 987);

	mock.getAllEntities("balloon");
	mock.getEntity(1010);
	mock.getRide(2020);
	mock.getTile(25, 17);
	t.deepEqual(hits, [ "balloon", 1010, 2020, "25,17" ]);
});


test("Get all entities from entities list", t =>
{
	const mock = GameMapMocker({
		entities: [
			Mock.entity({ id: 1, type: "balloon" }),
			Mock.entity({ id: 2, type: "duck" }),
			Mock.entity({ id: 3, type: "balloon" })
		]
	});

	const entities = mock.getAllEntities("balloon");

	t.is(entities.length, 2);
	t.is(entities[0].id, 1);
	t.is(entities[1].id, 3);
});


test("Get specific entity from entities list", t =>
{
	const mock = GameMapMocker({
		entities: [
			Mock.entity({ id: 1, type: "balloon" }),
			Mock.entity({ id: 2, type: "duck" }),
			Mock.entity({ id: 3, type: "balloon" })
		]
	});

	const entity = mock.getEntity(2);

	t.is(entity.type, "duck");
});


test("Get number of entities from entities list", t =>
{
	const mock = GameMapMocker({
		entities: [
			Mock.entity({ id: 1, type: "balloon" }),
			Mock.entity({ id: 2, type: "duck" }),
			Mock.entity({ id: 3, type: "balloon" })
		]
	});

	t.is(mock.numEntities, 3);
});


test("Get empty array if entities not specified", t =>
{
	const mock = GameMapMocker();

	const entities = mock.getAllEntities("balloon");

	t.deepEqual(entities, []);
	t.is(mock.numEntities, 0);
});


test("Unknown entity returns default mock", t =>
{
	const mock = GameMapMocker({
		entities: [
			Mock.entity({ id: 1, type: "balloon" })
		]
	});

	const entity = mock.getEntity(5);

	t.truthy(entity);
});


test("Get all rides from rides list", t =>
{
	const mock = GameMapMocker({
		rides: [
			Mock.ride({ id: 1, name: "a" }),
			Mock.ride({ id: 2, name: "b" }),
			Mock.ride({ id: 3, name: "c" })
		]
	});

	const rides = mock.rides;

	t.is(rides.length, 3);
	t.is(rides[0].name, "a");
	t.is(rides[1].name, "b");
	t.is(rides[2].name, "c");
});


test("Get specific ride from rides list", t =>
{
	const mock = GameMapMocker({
		rides: [
			Mock.ride({ id: 1, name: "a" }),
			Mock.ride({ id: 2, name: "b" }),
			Mock.ride({ id: 3, name: "c" })
		]
	});

	const ride = mock.getRide(3);

	t.is(ride.name, "c");
});


test("Get number of rides from rides list", t =>
{
	const mock = GameMapMocker({
		rides: [
			Mock.ride({ id: 1, name: "a" }),
			Mock.ride({ id: 2, name: "b" }),
			Mock.ride({ id: 3, name: "c" })
		]
	});

	t.is(mock.numRides, 3);
});


test("Get rides always returns a valid array.", t =>
{
	const mock = GameMapMocker();

	t.deepEqual([], mock.rides);
});


test("Number of rides is zero if rides is not specified", t =>
{
	const mock = GameMapMocker();

	t.is(mock.numRides, 0);
});


test("Unknown ride throws error", t =>
{
	const mock = GameMapMocker({
		rides: [
			Mock.ride({ id: 1, name: "a" })
		]
	});

	const ride = mock.getRide(5);

	t.truthy(ride);
});


test("Always get tile from single set tile", t =>
{
	const mock = GameMapMocker({
		tiles: Mock.tile({ x: 1, y: 5 })
	});

	const tile = mock.getTile(3, 2);

	t.truthy(tile);
	t.is(tile.x, 1);
	t.is(tile.y, 5);
});


test("Get tile from single set tile with overriden coordinates if not specified", t =>
{
	const mock = GameMapMocker({
		tiles: Mock.tile({ numElements: 3 })
	});

	const tile = mock.getTile(5, 4);

	t.is(tile.numElements, 3);
	t.is(tile.x, 5);
	t.is(tile.y, 4);
});


test("Get specific tile from tile array", t =>
{
	const mock = GameMapMocker({
		tiles: [
			Mock.tile({ x: 1, y: 1 }),
			Mock.tile({ x: 1, y: 2 }),
			Mock.tile({ x: 2, y: 1 }),
			Mock.tile({ x: 2, y: 2 }),
		]
	});

	const tile = mock.getTile(2, 1);

	t.is(tile.x, 2);
	t.is(tile.y, 1);
});


test("Throw if tile is not in tile array", t =>
{
	const mock = GameMapMocker({
		tiles: [
			Mock.tile({ x: 1, y: 1 }),
			Mock.tile({ x: 1, y: 2 }),
			Mock.tile({ x: 2, y: 1 }),
			Mock.tile({ x: 2, y: 2 }),
		]
	});

	const tile = mock.getTile(2, 3);

	t.truthy(tile);
});


test("Throw if tiles not specified", t =>
{
	const mock = GameMapMocker();

	const tile = mock.getTile(2, 3);

	t.truthy(tile);
});