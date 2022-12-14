import test from "ava";
import { isGetter, clone, tryAddGet } from "../../src/utilities/object";


type TestObject = { a: number; b?: number };


test("clone is different but similar", t =>
{
	const obj: TestObject = { a: 5, b: 8 };

	const copy = clone(obj);

	t.not(copy, obj);
	t.deepEqual(copy, obj);
});


test("clone does not clone references", t =>
{
	const obj = { a: 5, b: { c: 6 } };

	const copy = clone(obj);

	t.not(copy, obj);
	t.is(copy.b, obj.b);
	t.deepEqual(copy, obj);
});


test("clone copies array", t =>
{
	const array: TestObject[] = [ { a: 5, b: 8 }, { a: 11 } ];

	const copy = clone(array);

	t.not(copy, array);
	t.is(copy[0], array[0]);
	t.is(copy[1], array[1]);
	t.deepEqual(copy, array);
});


test("tryAddGet adds getter", t =>
{
	const obj: TestObject = { a: 5 };

	tryAddGet(obj, "b", () => 7);

	t.is(obj.a, 5);
	t.is(obj.b, 7);
});


test("tryAddGet adds getter with this", t =>
{
	const obj: TestObject = { a: 5 };

	tryAddGet(obj, "b", function()
	{
		return this.a + 7;
	});

	t.is(obj.a, 5);
	t.is(obj.b, 12);
});


test("tryAddGet ensures property is still settable", t =>
{
	const obj: TestObject = { a: 5 };
	tryAddGet(obj, "b", () => 7);

	obj.b = 9;

	t.is(obj.a, 5);
	t.is(obj.b, 9);
});


test("isGetter detects getter", t =>
{
	const obj: TestObject = { a: 5 };
	tryAddGet(obj, "b", () => 7);

	t.true(isGetter(obj, "b"));
	t.false(isGetter(obj, "a"));
});