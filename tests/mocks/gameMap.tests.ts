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

	t.is(234, mock.numEntities);
	t.is(567, mock.numRides);
	t.is(987, mock.rides[0].id);

	mock.getAllEntities("balloon");
	mock.getEntity(1010);
	mock.getRide(2020);
	mock.getTile(25, 17);
	t.deepEqual([ "balloon", 1010, 2020, "25,17" ], hits);
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

	t.is(2, entities.length);
	t.is(1, entities[0].id);
	t.is(3, entities[1].id);
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

	t.is("duck", entity.type);
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

	t.is(3, mock.numEntities);
});


test("Get empty array if entities not specified", t =>
{
	const mock = GameMapMocker();

	const entities = mock.getAllEntities("balloon");

	t.deepEqual([], entities);
	t.is(0, mock.numEntities);
});


test("Unknown entity throws error", t =>
{
	const mock = GameMapMocker({
		entities: [
			Mock.entity({ id: 1, type: "balloon" })
		]
	});

	t.throws(() =>
	{
		mock.getEntity(5);
	});
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

	t.is(3, rides.length);
	t.is("a", rides[0].name);
	t.is("b", rides[1].name);
	t.is("c", rides[2].name);
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

	t.is("c", ride.name);
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

	t.is(3, mock.numRides);
});


test("Number of rides is zero if rides is not specified", t =>
{
	const mock = GameMapMocker();

	t.is(0, mock.numRides);
});


test("Unknown ride throws error", t =>
{
	const mock = GameMapMocker({
		rides: [
			Mock.ride({ id: 1, name: "a" })
		]
	});

	t.throws(() =>
	{
		mock.getRide(5);
	});
});


test("Always get tile from single set tile", t =>
{
	const mock = GameMapMocker({
		tiles: Mock.tile({ x: 1, y: 5 })
	});

	const tile = mock.getTile(3, 2);

	t.truthy(tile);
	t.is(1, tile.x);
	t.is(5, tile.y);
});


test("Get tile from single set tile with overriden coordinates if not specified", t =>
{
	const mock = GameMapMocker({
		tiles: Mock.tile({ numElements: 3 })
	});

	const tile = mock.getTile(5, 4);

	t.is(3, tile.numElements);
	t.is(5, tile.x);
	t.is(4, tile.y);
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

	t.is(2, tile.x);
	t.is(1, tile.y);
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

	t.throws(() =>
	{
		mock.getTile(2, 3);
	});
});


test("Throw if tiles not specified", t =>
{
	const mock = GameMapMocker();

	t.throws(() =>
	{
		mock.getTile(2, 3);
	});
});