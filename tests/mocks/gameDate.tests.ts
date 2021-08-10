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

	t.is(22, mock.yearsElapsed);
	t.is(5, mock.year);
	t.is(4, mock.month);
	t.is(3, mock.day);
});


test("Years elapsed is calculated from month elapsed", t =>
{
	const mock = GameDateMocker({ monthsElapsed: 23 });

	t.is(2, mock.yearsElapsed); // year = 8 months
});


test("Year is calculated from month elapsed", t =>
{
	const mock = GameDateMocker({ monthsElapsed: 23 });

	t.is(3, mock.year); // year = 8 months, starting at 1
});


test("Month is calculated from month elapsed", t =>
{
	const mock = GameDateMocker({ monthsElapsed: 20 });

	t.is(4, mock.month); // year = 8 months, month resets every year
});


test("Day is calculated from month progress", t =>
{
	const mock = GameDateMocker({ monthProgress: 32768 });

	t.is(15, mock.day); // should be middle of month
});


test("No params gives 1st of March year 1", t =>
{
	const mock = GameDateMocker();

	t.is(1, mock.day);
	t.is(0, mock.month);
	t.is(1, mock.year);
	t.is(0, mock.ticksElapsed);
	t.is(0, mock.monthProgress);
	t.is(0, mock.monthsElapsed);
	t.is(0, mock.yearsElapsed);
});