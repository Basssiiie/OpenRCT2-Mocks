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

	t.is(34, mock.numElements);
	t.is(765, mock.elements[0].baseZ);

	mock.getElement(1010);
	mock.insertElement(2020);
	mock.removeElement(3030);
	t.deepEqual([ 1010, 2020, 3030 ], hits);
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

	t.is(3, element.baseZ);
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
	t.is(4, mock.elements.length);
	t.is(element, mock.elements[1]);
});


test("Insert element without entities array", t =>
{
	const mock = TileMocker();

	const element = mock.insertElement(7);

	t.truthy(element);
	t.is(1, mock.elements.length);
	t.is(element, mock.elements[0]);
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

	t.is(2, mock.elements.length);
	t.is(1, mock.elements[0].baseZ);
	t.is(3, mock.elements[1].baseZ);
});


test("Get elements always returns a valid array", t =>
{
	const mock = TileMocker();

	t.deepEqual([], mock.elements);
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

	t.is(3, mock.numElements);
});