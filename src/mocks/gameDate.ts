import { Mocker } from "../core/mocker";
import { tryAddGet } from "../utilities/object";


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
	tryAddGet(mock, "yearsElapsed", () => (mock.monthsElapsed) ? Math.floor(mock.monthsElapsed / 8) : 0);
	tryAddGet(mock, "year", () => (mock.monthsElapsed) ? (Math.floor(mock.monthsElapsed / 8) + 1) : 1);
	tryAddGet(mock, "month", () => (mock.monthsElapsed) ? (mock.monthsElapsed % 8) : 0);
	tryAddGet(mock, "day", () => (mock.monthProgress) ? Math.floor(mock.monthProgress * GetDaysInMonth(mock.month) / 65536) : 1);

	return mock;
}


/**
 * Gets the number of days in the specified month.
 */
function GetDaysInMonth(month: Month | undefined): number
{
	switch (month)
	{
		case Month.April:
		case Month.June:
		case Month.September:
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
