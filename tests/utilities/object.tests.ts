import test from "ava";
import { isGetter, tryAddGet } from "../../src/utilities/object";


type TestObject = { a: number; b?: number };


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