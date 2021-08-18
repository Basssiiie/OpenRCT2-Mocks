/// <reference path="../../lib/openrct2.d.ts" />

import test from "ava";
import Mock from "../../src/index";
import { TileMocker } from "../../src/mocks/tile";


test("All auto-mocked members are overridable", t =>
{
	const hits: unknown[] = [];
	const mock = TileMocker({
		numElements: 34,
		elements: [ Mock.tileElement({ baseZ: 765 }) ],
		getElement(index: number) { hits.push(index); return {} as TileElement; },
		insertElement(index: number) { hits.push(index); return {} as TileElement; },
		removeElement(index: number) { hits.push(index); },
	});

	t.is(mock.numElements, 34);
	t.is(mock.elements[0].baseZ, 765);

	mock.getElement(1010);
	mock.insertElement(2020);
	mock.removeElement(3030);
	t.deepEqual(hits, [ 1010, 2020, 3030 ]);
});


test("Default tile has surface element only", t =>
{
	const mock = TileMocker();

	t.is(mock.numElements, 1);
	t.is(mock.elements.length, 1);
	t.is(mock.elements[0].type, "surface");
});


test("Get element at index", t =>
{
	const mock = TileMocker({
		elements: [
			Mock.tileElement({ baseZ: 1 }),
			Mock.tileElement({ baseZ: 2 }),
			Mock.tileElement({ baseZ: 3 }),
		]
	});

	const element = mock.getElement(2);

	t.is(element.baseZ, 3);
});


test("Insert element at index", t =>
{
	const mock = TileMocker({
		elements: [
			Mock.tileElement({ baseZ: 1 }),
			Mock.tileElement({ baseZ: 2 }),
			Mock.tileElement({ baseZ: 3 }),
		]
	});

	const element = mock.insertElement(1);

	t.truthy(element);
	t.is(mock.elements.length, 4);
	t.is(element, mock.elements[1]);
});


test("Insert element without elements array", t =>
{
	const mock = TileMocker();

	const element = mock.insertElement(7);

	t.truthy(element);
	t.is(mock.elements.length, 2);
	t.not(element, mock.elements[0]); // = surface
	t.is(element, mock.elements[1]);
});


test("Remove element at index", t =>
{
	const mock = TileMocker({
		elements: [
			Mock.tileElement({ baseZ: 1 }),
			Mock.tileElement({ baseZ: 2 }),
			Mock.tileElement({ baseZ: 3 }),
		]
	});

	mock.removeElement(1);

	t.is(mock.elements.length, 2);
	t.is(mock.elements[0].baseZ, 1);
	t.is(mock.elements[1].baseZ, 3);
});


test("Get elements always returns a valid array", t =>
{
	const mock = TileMocker();

	t.true(Array.isArray(mock.elements));
});


test("Get number of element", t =>
{
	const mock = TileMocker({
		elements: [
			Mock.tileElement({ baseZ: 1 }),
			Mock.tileElement({ baseZ: 2 }),
			Mock.tileElement({ baseZ: 3 }),
		]
	});

	t.is(mock.numElements, 3);
});