/// <reference path="../../lib/openrct2.d.ts" />

import test from "ava";
import { TileElementMocker } from "../../src/mocks/elements/tileElement";


test("All auto-mocked members are overridable", t =>
{
	const mock = TileElementMocker({
		type: "banner",
		isGhost: true,
		isHidden: true,
		occupiedQuadrants: 1,
		baseHeight: 2,
		baseZ: 3,
		clearanceHeight: 4,
		clearanceZ: 5
	});

	t.is(mock.type, "banner");
	t.true(mock.isGhost);
	t.true(mock.isHidden);
	t.is(mock.occupiedQuadrants, 1);
	t.is(mock.baseHeight, 2);
	t.is(mock.baseZ, 3);
	t.is(mock.clearanceHeight, 4);
	t.is(mock.clearanceZ, 5);
});


test("Heights are calculated from Z if set", t =>
{
	const mock = TileElementMocker({
		baseZ: 16,
		clearanceZ: 30
	});

	t.is(mock.baseHeight, 2);
	t.is(mock.clearanceHeight, 3);
});


test("Zs are calculated from height if set", t =>
{
	const mock = TileElementMocker({
		baseHeight: 2,
		clearanceHeight: 4
	});

	t.is(mock.baseZ, 2 * 8);
	t.is(mock.clearanceZ, 4 * 8);
});


test("Unspecified heights and Zs are zeroed and assignable later", t =>
{
	const mock = TileElementMocker();

	t.is(mock.baseHeight, 0);
	t.is(mock.baseZ, 0);
	t.is(mock.clearanceHeight, 0);
	t.is(mock.clearanceZ, 0);

	mock.baseHeight = 1;
	mock.baseZ = 2;
	mock.clearanceHeight = 3;
	mock.clearanceZ = 4;

	t.is(mock.baseHeight, 1);
	t.is(mock.baseZ, 2);
	t.is(mock.clearanceHeight, 3);
	t.is(mock.clearanceZ, 4);
});
