/// <reference path="../../lib/openrct2.d.ts" />

import test from "ava";
import { GameDateMocker } from "../../src/mocks/gameDate";


test("All auto-mocked members are overridable", t =>
{
	const mock = GameDateMocker({
		yearsElapsed: 22,
		year: 5,
		month: 4,
		day: 3
	});

	t.is(mock.yearsElapsed, 22);
	t.is(mock.year, 5);
	t.is(mock.month, 4);
	t.is(mock.day, 3);
});


test("Years elapsed is calculated from month elapsed", t =>
{
	const mock = GameDateMocker({ monthsElapsed: 23 });

	t.is(mock.yearsElapsed, 2); // year = 8 months
});


test("Year is calculated from month elapsed", t =>
{
	const mock = GameDateMocker({ monthsElapsed: 23 });

	t.is(mock.year, 3); // year = 8 months, starting at 1
});


test("Month is calculated from month elapsed", t =>
{
	const mock = GameDateMocker({ monthsElapsed: 20 });

	t.is(mock.month, 4); // year = 8 months, month resets every year
});


test("Day is calculated from month progress", t =>
{
	const mock = GameDateMocker({ monthProgress: 32768 });

	t.is(mock.day, 5); // should be middle of month
});


test("No params gives 1st of March year 1", t =>
{
	const mock = GameDateMocker();

	t.is(mock.day, 1);
	t.is(mock.month, 0);
	t.is(mock.year, 1);
	t.is(mock.ticksElapsed, 0);
	t.is(mock.monthProgress, 0);
	t.is(mock.monthsElapsed, 0);
	t.is(mock.yearsElapsed, 0);
});