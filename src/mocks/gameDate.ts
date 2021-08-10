import { Mocker } from "../core/mocker";


/**
 * A mock of OpenRCT2's dating system.
 * @internal
 */
export function GameDateMocker(template?: Partial<GameDate>): GameDate
{
	const mock = Mocker({
		ticksElapsed: 0,
		monthsElapsed: 0,
		monthProgress: 0,

		...template,
	});
	if (!("yearsElapsed" in mock)) // Calculate from 'monthsElapsed' if not present.
	{
		Object.defineProperty(mock, "yearsElapsed", {
			configurable: true, enumerable: true,
			get: () => (mock.monthsElapsed)
				? Math.floor(mock.monthsElapsed / 8) : 0
		});
	}
	if (!("year" in mock)) // Calculate from 'monthsElapsed' if not present.
	{
		Object.defineProperty(mock, "year", {
			configurable: true, enumerable: true,
			get: () => (mock.monthsElapsed)
				? (Math.floor(mock.monthsElapsed / 8) + 1) : 1
		});
	}
	if (!("month" in mock)) // Calculate from 'monthsElapsed' if not present.
	{
		Object.defineProperty(mock, "month", {
			configurable: true, enumerable: true,
			get: () => (mock.monthsElapsed)
				? (mock.monthsElapsed % 8) : 0
		});
	}
	if (!("day" in mock)) // Calculate from 'monthProgress' if not present.
	{
		Object.defineProperty(mock, "day", {
			configurable: true, enumerable: true,
			get: () => (mock.monthProgress)
				? Math.floor(mock.monthProgress * GetDaysInMonth(mock.month) / 65536) : 1
		});
	}
	return mock;
}


/**
 * Gets the number of days in the specified month.
 */
function GetDaysInMonth(month: Month | undefined): number
{
	switch (month)
	{
		case Month.April, Month.June, Month.September:
			return 30;
		default: // all other months + undefined (imply as March)
			return 31;
	}
}


/**
 * Available months in OpenRCT2.
 */
const enum Month
{
	March,
	April,
	May,
	June,
	July,
	August,
	September,
	October
}
