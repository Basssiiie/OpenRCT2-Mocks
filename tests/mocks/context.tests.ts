/// <reference path="../../lib/openrct2.d.ts" />

import test from "ava";
import Mock from "../../src";
import { ContextMocker } from "../../src/mocks/context";


test("All auto-mocked members are overridable", t =>
{
	const hits: string[] = [];
	const mock = ContextMocker({
		apiVersion: 23,
		mode: "scenario_editor",
		getObject() { hits.push("getObject"); return <never>{}; },
		getAllObjects() { hits.push("getAllObjects"); return []; },
		getTrackSegment() { hits.push("getTrackSegment"); return null; },
		subscribe() { hits.push("subscribe"); return <never>{}; },
		registerAction() { hits.push("registerAction"); },
		queryAction() { hits.push("queryAction"); },
		executeAction() { hits.push("executeAction"); },
		getRandom() { hits.push("getRandom"); return 3; },
	});

	t.is(mock.apiVersion, 23);
	t.is(mock.mode, "scenario_editor");
	mock.getObject("banner", 4);
	mock.getAllObjects("music");
	mock.getTrackSegment(6);
	mock.subscribe("action.location", () => { /* action */ });
	mock.registerAction("qq", () => <never>({}), () => <never>({}));
	mock.queryAction("bb", () => { /* action */ });
	mock.executeAction("cc", () => { /* action */ });
	mock.getRandom(7, 9);
	t.deepEqual(hits, [ "getObject", "getAllObjects", "getTrackSegment", "subscribe", "registerAction", "queryAction", "executeAction", "getRandom"]);
});


test("Get object from objects array by id", t =>
{
	const mock = ContextMocker({ objects: [
		Mock.loadedObject({ index: 88, name: "aa", type: "banner" }),
		Mock.loadedObject({ index: 78, name: "bb", type: "banner" }),
		Mock.loadedObject({ index: 22, name: "cc", type: "banner" }),
	]});

	const object = mock.getObject("banner", 78);

	t.is(object.index, 78);
	t.is(object.type, "banner");
	t.is(object.name, "bb");
});


test("Get object from objects array filters by type", t =>
{
	const mock = ContextMocker({ objects: [
		Mock.loadedObject({ index: 10, name: "aa", type: "banner" }),
		Mock.loadedObject({ index: 10, name: "bb", type: "footpath" }),
		Mock.loadedObject({ index: 10, name: "cc", type: "park_entrance" }),
		Mock.loadedObject({ index: 10, name: "dd", type: "music" }),
	]});

	const object = mock.getObject("park_entrance", 10);

	t.is(object.index, 10);
	t.is(object.type, "park_entrance");
	t.is(object.name, "cc");
});


test("Get object from objects array returns null if not found", t =>
{
	const mock = ContextMocker({ objects: [
		Mock.loadedObject({ index: 11, name: "aa", type: "park_entrance" }),
		Mock.loadedObject({ index: 12, name: "bb", type: "music" }),
	]});

	const object = mock.getObject("park_entrance", 10);

	t.is(object, <never>null);
});


test("Get all object from objects array filters by type", t =>
{
	const mock = ContextMocker({ objects: [
		Mock.loadedObject({ index: 11, name: "aa", type: "banner" }),
		Mock.loadedObject({ index: 12, name: "bb", type: "footpath" }),
		Mock.loadedObject({ index: 13, name: "cc", type: "park_entrance" }),
		Mock.loadedObject({ index: 14, name: "dd", type: "footpath" }),
	]});

	const objects = mock.getAllObjects("footpath");

	t.is(objects.length, 2);
	t.is(objects[0].index, 12);
	t.is(objects[0].type, "footpath");
	t.is(objects[0].name, "bb");
	t.is(objects[1].index, 14);
	t.is(objects[1].type, "footpath");
	t.is(objects[1].name, "dd");
});


test("Get track segment returns mocker with correct type", t =>
{
	const mock = ContextMocker();

	const object = mock.getTrackSegment(678);

	t.truthy(object);
	t.is(object?.type, 678);
});


test("Subscribe to hook gets registered", t =>
{
	const mock = ContextMocker();

	mock.subscribe("action.location", () => { /* nothin */ });

	t.is(mock.subscriptions.length, 1);
	t.is(mock.subscriptions[0].hook, "action.location");
	t.false(mock.subscriptions[0].isDisposed);
});


test("Subscribe to hook gets registered then disposed", t =>
{
	const mock = ContextMocker();

	const disposable = mock.subscribe("action.location", () => { /* nothin */ });

	t.is(mock.subscriptions.length, 1);
	t.false(mock.subscriptions[0].isDisposed);

	disposable.dispose();
	t.true(mock.subscriptions[0].isDisposed);
});


test("Subscribe to hook gets registered and called", t =>
{
	const mock = ContextMocker();
	const calls: VehicleCrashArgs[] = [];

	mock.subscribe("vehicle.crash", e => calls.push(e));
	mock.subscriptions[0].callback({ id: 45, crashIntoType: "water" });

	t.deepEqual(calls, [ { id: 45, crashIntoType: "water" } ]);
});


test("Action is registered", t =>
{
	const mock = ContextMocker();

	mock.registerAction("abc", () => <never>({}), () => <never>({}));

	t.is(mock.registeredActions.length, 1);
	t.is(mock.registeredActions[0].action, "abc");
	t.is(typeof mock.registeredActions[0].query, "function");
	t.is(typeof mock.registeredActions[0].execute, "function");
});


test("Action can be queried", t =>
{
	const mock = ContextMocker();
	const calls: object[] = [];

	mock.registerAction("blabla", e => { calls.push(e); return { cost: 45 }; }, () => <never>({}));

	const result = mock.registeredActions[0].query({ test: 77 });

	t.deepEqual(result, { cost: 45 });
	t.deepEqual(calls, [ { test: 77 } ]);
});


test("Action can be executed", t =>
{
	const mock = ContextMocker();
	const calls: object[] = [];

	mock.registerAction("blob", () => <never>({}), e => { calls.push(e); return { cost: 24 }; });

	const result = mock.registeredActions[0].execute({ test: 5 });

	t.deepEqual(result, { cost: 24 });
	t.deepEqual(calls, [ { test: 5 } ]);
});


test("Action can be queried then executed", t =>
{
	const mock = ContextMocker();
	const calls: object[] = [];

	mock.registerAction("blabla",
		e => { calls.push(e); return { cost: 10 }; },
		e => { calls.push(e); return { cost: 25 }; }
	);

	const result1 = mock.registeredActions[0].query({ test: 55 });
	const result2 = mock.registeredActions[0].execute({ test: 66 });

	t.deepEqual(result1, { cost: 10 });
	t.deepEqual(result2, { cost: 25 });
	t.deepEqual(calls, [ { test: 55 }, { test: 66 } ]);
});


test("Query action to query custom action", t =>
{
	const mock = ContextMocker();
	const calls: object[] = [];

	mock.registerAction("blabla",
		e => { calls.push(e); return { cost: 25 }; },
		e => { calls.push(e); return { cost: 35 }; }
	);

	mock.queryAction("blabla", { test: 45 }, e => calls.push({ result: `cost = ${e.cost}` }));

	t.deepEqual(calls, [ { test: 45 }, { result: "cost = 25" } ]);
});


test("Query action triggers subscriptions", t =>
{
	const mock = ContextMocker();
	const calls: object[] = [];

	mock.subscribe("action.query", e => calls.push({ sub: e.action, arg: e.args }));

	mock.registerAction("blabla",
		e => { calls.push(e); return { cost: 25 }; },
		e => { calls.push(e); return { cost: 35 }; }
	);

	mock.queryAction("blabla", { test: 45 }, e => calls.push({ result: `cost = ${e.cost}` }));

	t.deepEqual(calls, [ { test: 45 }, { sub: "blabla", arg: { test: 45 } }, { result: "cost = 25" } ]);
});


test("Execute action to execute custom action", t =>
{
	const mock = ContextMocker();
	const calls: object[] = [];

	mock.registerAction("blabla",
		e => { calls.push(e); return { cost: 25 }; },
		e => { calls.push(e); return { cost: 35 }; }
	);

	mock.executeAction("blabla", { test: 45 }, e => calls.push({ result: `cost = ${e.cost}` }));

	t.deepEqual(calls, [ { test: 45 }, { result: "cost = 35" } ]);
});


test("Execute action triggers subscriptions", t =>
{
	const mock = ContextMocker();
	const calls: object[] = [];

	mock.subscribe("action.execute", e => calls.push({ sub: e.action, arg: e.args }));

	mock.registerAction("blabla",
		e => { calls.push(e); return { cost: 25 }; },
		e => { calls.push(e); return { cost: 40 }; }
	);

	mock.executeAction("blabla", { test: 35 }, e => calls.push({ result: `cost = ${e.cost}` }));

	t.deepEqual(calls, [ { test: 35 }, { sub: "blabla", arg: { test: 35 } }, { result: "cost = 40" } ]);
});


test("Get type id for action", t =>
{
	const mock = ContextMocker({
		getTypeIdForAction: (action: string) => action.length
	});

	const hits: number[] = [];
	mock.subscribe("action.execute", t => hits.push(t.type));

	mock.executeAction("balloonpress", {});
	t.deepEqual(hits, [ 12 ]);

	mock.executeAction("landraise", {});
	t.deepEqual(hits, [ 12, 9 ]);

	mock.executeAction("largescenerysetcolour", {});
	t.deepEqual(hits, [ 12, 9, 21 ]);
});


test("Get icon id takes name length", t =>
{
	const mock = ContextMocker();

	t.is(mock.getIcon("arrow_down"), 10);
	t.is(mock.getIcon("rct1_simulate_off_pressed"), 25);
	t.is(mock.getIcon("chat"), 4);
});


test("Get random returns min by default", t =>
{
	const mock = ContextMocker();

	t.is(mock.getRandom(2, 10), 2);
	t.is(mock.getRandom(2000005, 99933339999), 2000005);
	t.is(mock.getRandom(-100033, 0), -100033);
});


test("Format string formats arguments into tokens instead of replacing them", t =>
{
	const mock = ContextMocker();

	const actual = mock.formatString("Test: {STRING} you are a {COMMA32}!", "Hello", 100);
	t.is(actual, "Test: {STRING=Hello} you are a {COMMA32=100}!");
});


test("Format string ignores other tokens", t =>
{
	const mock = ContextMocker();

	const actual = mock.formatString("{PUSH16} {BLACK} {OUTLINE} {HALF A TOKEN {COMMA1DP16}!", 999);
	t.is(actual, "{PUSH16} {BLACK} {OUTLINE} {HALF A TOKEN {COMMA1DP16=999}!");
});
