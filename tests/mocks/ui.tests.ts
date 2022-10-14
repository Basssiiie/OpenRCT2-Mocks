/// <reference path="../../lib/openrct2.d.ts" />

import test from "ava";
import { WindowMock } from "../../src";
import { UiMocker } from "../../src/mocks/ui/ui";


test("All auto-mocked members are overridable", t =>
{
	const hits: unknown[] = [];
	const mock = UiMocker({
		mainViewport: { left: 55 } as Viewport,
		openWindow(desc: WindowDesc) { hits.push(desc.classification); return {} as Window; },
		closeWindows(classification: string, id?: number) { hits.push([classification, id]); },
		getWindow(id: string | number){ hits.push(id); return {} as Window; },
	});

	t.is(mock.mainViewport.left, 55);

	mock.openWindow({ classification: "open" } as WindowDesc);
	mock.closeWindows("close", 55);
	mock.getWindow("get");

	t.deepEqual(hits, [ "open", [ "close", 55 ], "get" ]);
});


test("Main viewport is valid viewport", t =>
{
	const mock = UiMocker();

	const viewport = mock.mainViewport;
	t.truthy(viewport);

	viewport.moveTo({ x: 2000, y: 3000 });
	t.truthy(viewport.left);
	t.truthy(viewport.right);
	t.truthy(viewport.bottom);
	t.truthy(viewport.top);
});


test("Open window gets added to created", t =>
{
	const mock = UiMocker();

	const window = mock.openWindow({
		classification: "test",
		width: 50, height: 80,
		title: "hello world"
	});

	t.is(window.width, 50);
	t.is(window.height, 80);
	t.is(window.title, "hello world");

	const windowMock = window as WindowMock;
	t.true(mock.createdWindows.includes(windowMock));
	t.true(windowMock.isOpen);
});


test("Open window with viewport gets polyfilled", t =>
{
	const mock = UiMocker();

	const window = mock.openWindow({
		classification: "test 1", title: "test 2",
		width: 50, height: 80,
		widgets: [
			<ViewportWidget>{
				width: 20, height: 20,
				type: "viewport",
			}
		]
	});

	const widget = window.widgets[0] as ViewportWidget;
	t.truthy(widget);
	t.is(widget.type, "viewport");

	const viewport = widget.viewport;
	viewport?.moveTo({ x: 700, y: 900 });
	t.truthy(viewport?.left);
	t.truthy(viewport?.right);
	t.truthy(viewport?.top);
	t.truthy(viewport?.bottom);

	const center = viewport?.getCentrePosition();
	t.is(center?.x, 700);
	t.is(center?.y, 900);
});


test("Close all windows calls closed", t =>
{
	const hits: string[] = [];
	const mock = UiMocker();

	const window1 = mock.openWindow({
		classification: "test 1", title: "title 1",
		width: 250, height: 200,
		onClose: () => hits.push("hit 1")
	});
	const window2 = mock.openWindow({
		classification: "test 2", title: "title 2",
		width: 250, height: 200,
		onClose: () => hits.push("hit 2")
	});

	mock.closeAllWindows();

	t.false((window1 as WindowMock).isOpen);
	t.false((window2 as WindowMock).isOpen);
	t.is(hits.filter(h => h === "hit 1").length, 1);
	t.is(hits.filter(h => h === "hit 2").length, 1);
});


test("Close window calls closed", t =>
{
	t.plan(2);
	const mock = UiMocker();

	const window = mock.openWindow({
		classification: "test 1", title: "test 2",
		width: 250, height: 200,
		onClose: () => t.pass()
	});

	mock.closeWindows("test 1");

	const windowMock = window as WindowMock;
	t.false(windowMock.isOpen);
});


test("Get window gets window", t =>
{
	const mock = UiMocker();

	const window = mock.openWindow({
		classification: "test get", title: "get title",
		width: 250, height: 200,
	});

	const get = mock.getWindow("test get");

	t.is(window, get);
});


test("Get unknown window returns null", t =>
{
	const mock = UiMocker();

	const unknown = mock.getWindow("get unknown");

	t.is(unknown, <Window><unknown>null);
});