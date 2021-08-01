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

	t.is(246, mock.guests);

	mock.getFlag("open");
	mock.setFlag("noMoney", true);
	t.deepEqual([ "open","noMoney" ], hits);
});


test("Guest count is 0 by default", t =>
{
	const mock = ParkMocker();

	t.is(0, mock.guests);
});


test("Guest count set overrides default", t =>
{
	const mock = ParkMocker({ guests: 12 });

	t.is(12, mock.guests);
});


test("Guest count counts map entities when present", t =>
{
	global.map = Mock.map({
		entities: [	Mock.guest(),	Mock.staff(), Mock.guest(), Mock.guest() ]
	});

	const mock = ParkMocker();

	t.is(3, mock.guests);
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
	t.is(1, mock.flags.filter(f => f === "unlockAllPrices").length);
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