/// <reference path="../../lib/openrct2.d.ts" />

import test from "ava";
import Mock from "../../src/index";
import { ParkMocker } from "../../src/mocks/park";


test("All auto-mocked members are overridable", t =>
{
	const hits: string[] = [];
	const mock = ParkMocker({
		guests: 246,
		getFlag(flag: ParkFlags) { hits.push(flag); return true; },
		setFlag(flag: ParkFlags) { hits.push(flag); },
	});

	t.is(mock.guests, 246);

	mock.getFlag("open");
	mock.setFlag("noMoney", true);
	t.deepEqual(hits, [ "open","noMoney" ]);
});


test("Guest count is 0 by default", t =>
{
	const mock = ParkMocker();

	t.is(mock.guests, 0);
});


test("Guest count set overrides default", t =>
{
	const mock = ParkMocker({ guests: 12 });

	t.is(mock.guests, 12);
});


test("Guest count counts guests on map when present", t =>
{
	global.map = Mock.map({
		entities: [	Mock.guest(), Mock.staff(), Mock.guest(), Mock.guest() ]
	});

	const mock = ParkMocker();

	t.is(mock.guests, 3);
});


test("Guest count skips guests not in park", t =>
{
	global.map = Mock.map({
		entities: [
			Mock.guest({ isInPark: false }),
			Mock.guest({ isInPark: true }),
			Mock.guest({ isInPark: false })
		]
	});

	const mock = ParkMocker();

	t.is(mock.guests, 1);
});


test("Get flag when no flags", t =>
{
	const mock = ParkMocker();

	t.false(mock.getFlag("freeParkEntry"));
});


test("Get flag when not present", t =>
{
	const mock = ParkMocker({ flags: [ "forbidTreeRemoval" ] });

	t.false(mock.getFlag("difficultParkRating"));
});


test("Get flag when present", t =>
{
	const mock = ParkMocker({ flags: [ "noMoney", "unlockAllPrices" ] });

	t.true(mock.getFlag("unlockAllPrices"));
});


test("Set flag is added", t =>
{
	const mock = ParkMocker({ flags: [ "freeParkEntry" ] });

	mock.setFlag("unlockAllPrices", true);

	t.true(mock.getFlag("unlockAllPrices"));
});


test("Set flag is added only once", t =>
{
	const mock = ParkMocker({ flags: [ "unlockAllPrices" ] });

	mock.setFlag("unlockAllPrices", true);

	t.true(mock.getFlag("unlockAllPrices"));
	t.is(mock.flags.filter(f => f === "unlockAllPrices").length, 1);
});


test("Set flag is added when empty", t =>
{
	const mock = ParkMocker();

	mock.setFlag("freeParkEntry", true);

	t.true(mock.getFlag("freeParkEntry"));
});


test("Set flag is removed", t =>
{
	const mock = ParkMocker({ flags: [ "freeParkEntry" ] });

	mock.setFlag("freeParkEntry", false);

	t.false(mock.getFlag("freeParkEntry"));
});


test("Set flag does nothing when not present", t =>
{
	const mock = ParkMocker({ flags: [ "noMoney" ]});

	mock.setFlag("open", false);

	t.false(mock.getFlag("open"));
});


test("Set flag does nothing when no flags present", t =>
{
	const mock = ParkMocker();

	mock.setFlag("open", false);

	t.false(mock.getFlag("open"));
});